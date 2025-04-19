using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ChatbotApi.Models;
using Azure;
using Azure.AI.OpenAI;
using Azure.Core;
using Azure.Core.Pipeline;
using Microsoft.Extensions.Configuration;
using System.Text;
using Microsoft.AspNetCore.Cors;

// Custom policy for adding the OpenAI Organization ID header
internal sealed class OrganizationHeaderPolicy : HttpPipelineSynchronousPolicy
{
    private readonly string _organizationId;

    public OrganizationHeaderPolicy(string organizationId)
    {
        _organizationId = organizationId;
    }

    public override void OnSendingRequest(HttpMessage message)
    {
        message.Request.Headers.Add("OpenAI-Organization", _organizationId);
    }
}

// Custom policy for adding the API version header
internal sealed class ApiVersionHeaderPolicy : HttpPipelineSynchronousPolicy
{
    private readonly string _apiVersion;

    public ApiVersionHeaderPolicy(string apiVersion)
    {
        _apiVersion = apiVersion;
    }

    public override void OnSendingRequest(HttpMessage message)
    {
        // For project API keys, OpenAI recommends setting the API version in the header
        message.Request.Headers.Add("api-version", _apiVersion);
        
        // For debugging
        Console.WriteLine($"Setting API version in header: {_apiVersion}");
    }
}

namespace ChatbotApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowFrontend")]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ChatController> _logger;

        public ChatController(IConfiguration configuration, ILogger<ChatController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        [EnableCors("AllowFrontend")]
        public async Task<IActionResult> Post([FromBody] ChatRequest request)
        {
            try
            {
                if (request.Messages == null || !request.Messages.Any())
                {
                    return BadRequest("No messages provided");
                }

                string apiKey = _configuration["OpenAI:ApiKey"];
                
                if (string.IsNullOrEmpty(apiKey))
                {
                    _logger.LogError("OpenAI API key not configured");
                    return StatusCode(500, "OpenAI API key not configured");
                }

                // Format messages for OpenAI
                var formattedMessages = request.Messages.ToList();
                
                // If there's a system message, add formatting instructions
                if (formattedMessages.Count > 0 && formattedMessages[0].Role.ToLower() == "system")
                {
                    formattedMessages[0].Content += " Use **asterisks** for important points or emphasis, which will be rendered as bold text. Use *single asterisks* for italic text to emphasize product names or features.";
                }

                // Create OpenAI client
                OpenAIClient openAIClient;
                string organizationId = _configuration["OpenAI:OrganizationId"];
                
                var options = new OpenAIClientOptions();
                
                // Add organization if available
                if (!string.IsNullOrEmpty(organizationId))
                {
                    _logger.LogInformation("Using organization ID with OpenAI client");
                    options.AddPolicy(new OrganizationHeaderPolicy(organizationId), HttpPipelinePosition.PerCall);
                }
                
                // Add API version for project API keys
                if (apiKey.StartsWith("sk-proj-"))
                {
                    _logger.LogInformation("Using project API key format, setting API version explicitly");
                    options.AddPolicy(new ApiVersionHeaderPolicy("2024-04-15"), HttpPipelinePosition.PerCall);
                }
                
                // Set correct endpoint - using direct OpenAI API for project keys
                var endpoint = apiKey.StartsWith("sk-proj-") 
                    ? "https://api.openai.com/v1" 
                    : _configuration["OpenAI:Endpoint"] ?? "https://api.openai.com/v1";
                
                _logger.LogInformation("Using endpoint: {Endpoint}", endpoint);
                
                openAIClient = new OpenAIClient(
                    new Uri(endpoint),
                    new AzureKeyCredential(apiKey),
                    options
                );

                var chatCompletionsOptions = new ChatCompletionsOptions
                {
                    // Set the deployment name based on whether it's a project key or not
                    DeploymentName = apiKey.StartsWith("sk-proj-") ? "gpt-4o-mini" : _configuration["OpenAI:DefaultModel"] ?? "gpt-4o-mini",
                    MaxTokens = request.MaxTokens ?? 400,
                    Temperature = request.Temperature ?? 0.7f
                };
                
                _logger.LogInformation("Using model: {Model}", chatCompletionsOptions.DeploymentName);

                // Add messages to the request
                foreach (var message in formattedMessages)
                {
                    if (message.Role.ToLower() == "system")
                    {
                        chatCompletionsOptions.Messages.Add(new ChatRequestSystemMessage(message.Content));
                    }
                    else if (message.Role.ToLower() == "user")
                    {
                        chatCompletionsOptions.Messages.Add(new ChatRequestUserMessage(message.Content));
                    }
                    else if (message.Role.ToLower() == "assistant")
                    {
                        chatCompletionsOptions.Messages.Add(new ChatRequestAssistantMessage(message.Content));
                    }
                }

                Response<ChatCompletions> response = await openAIClient.GetChatCompletionsAsync(chatCompletionsOptions);
                
                string responseMessage = response.Value.Choices[0].Message.Content;

                _logger.LogInformation("Successfully received response from OpenAI API.");

                return Ok(new ChatResponse { 
                    Message = responseMessage,
                    Usage = new ChatUsage {
                        PromptTokens = response.Value.Usage.PromptTokens,
                        CompletionTokens = response.Value.Usage.CompletionTokens,
                        TotalTokens = response.Value.Usage.TotalTokens
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in chat API route");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("stream")]
        [EnableCors("AllowFrontend")]
        public async Task StreamCompletion([FromBody] ChatRequest request)
        {
            if (request.Messages == null || !request.Messages.Any())
            {
                Response.StatusCode = 400;
                await Response.WriteAsync("No messages provided");
                return;
            }

            string apiKey = _configuration["OpenAI:ApiKey"];
            
            if (string.IsNullOrEmpty(apiKey))
            {
                Response.StatusCode = 500;
                await Response.WriteAsync("OpenAI API key not configured");
                return;
            }

            // Set correct headers for SSE
            Response.Headers["Content-Type"] = "text/event-stream";
            Response.Headers["Cache-Control"] = "no-cache";
            Response.Headers["Connection"] = "keep-alive";

            try
            {
                _logger.LogInformation("Starting streaming request with {MessageCount} messages", request.Messages.Count);
                
                // Format messages for OpenAI
                var formattedMessages = request.Messages.ToList();
                
                // If there's a system message, add formatting instructions
                if (formattedMessages.Count > 0 && formattedMessages[0].Role.ToLower() == "system")
                {
                    formattedMessages[0].Content += " Use **asterisks** for important points or emphasis, which will be rendered as bold text. Use *single asterisks* for italic text to emphasize product names or features.";
                }

                // Create OpenAI client
                OpenAIClient openAIClient;
                string organizationId = _configuration["OpenAI:OrganizationId"];
                
                var options = new OpenAIClientOptions();
                
                // Add organization if available
                if (!string.IsNullOrEmpty(organizationId))
                {
                    _logger.LogInformation("Using organization ID with OpenAI client");
                    options.AddPolicy(new OrganizationHeaderPolicy(organizationId), HttpPipelinePosition.PerCall);
                }
                
                // Add API version for project API keys
                if (apiKey.StartsWith("sk-proj-"))
                {
                    _logger.LogInformation("Using project API key format, setting API version explicitly");
                    options.AddPolicy(new ApiVersionHeaderPolicy("2024-04-15"), HttpPipelinePosition.PerCall);
                }
                
                // Set correct endpoint - using direct OpenAI API for project keys
                var endpoint = apiKey.StartsWith("sk-proj-") 
                    ? "https://api.openai.com/v1" 
                    : _configuration["OpenAI:Endpoint"] ?? "https://api.openai.com/v1";
                
                _logger.LogInformation("Using endpoint: {Endpoint}", endpoint);
                
                openAIClient = new OpenAIClient(
                    new Uri(endpoint),
                    new AzureKeyCredential(apiKey),
                    options
                );

                var chatCompletionsOptions = new ChatCompletionsOptions
                {
                    // Set the deployment name based on whether it's a project key or not
                    DeploymentName = apiKey.StartsWith("sk-proj-") ? "gpt-4o-mini" : _configuration["OpenAI:DefaultModel"] ?? "gpt-4o-mini",
                    MaxTokens = request.MaxTokens ?? 400,
                    Temperature = request.Temperature ?? 0.7f
                };
                
                _logger.LogInformation("Using model: {Model}", chatCompletionsOptions.DeploymentName);

                // Add messages to the request
                foreach (var message in formattedMessages)
                {
                    if (message.Role.ToLower() == "system")
                    {
                        chatCompletionsOptions.Messages.Add(new ChatRequestSystemMessage(message.Content));
                        _logger.LogDebug("Added system message: {SystemMessage}", message.Content.Substring(0, Math.Min(50, message.Content.Length)) + "...");
                    }
                    else if (message.Role.ToLower() == "user")
                    {
                        chatCompletionsOptions.Messages.Add(new ChatRequestUserMessage(message.Content));
                        _logger.LogDebug("Added user message: {UserMessage}", message.Content);
                    }
                    else if (message.Role.ToLower() == "assistant")
                    {
                        chatCompletionsOptions.Messages.Add(new ChatRequestAssistantMessage(message.Content));
                        _logger.LogDebug("Added assistant message: {AssistantMessage}", message.Content.Substring(0, Math.Min(50, message.Content.Length)) + "...");
                    }
                }

                _logger.LogInformation("Getting streaming response from OpenAI");
                var streamingResponse = await openAIClient.GetChatCompletionsStreamingAsync(
                    chatCompletionsOptions);

                StringBuilder fullMessageBuilder = new StringBuilder();
                _logger.LogInformation("Starting to process streaming response");

                // Send an immediate response to ensure connection is established
                await Response.WriteAsync($"data: {{\n\n");
                await Response.Body.FlushAsync();

                await foreach (StreamingChatCompletionsUpdate update in streamingResponse)
                {
                    if (update.ChoiceIndex == 0 && update.ContentUpdate != null)
                    {
                        // Append to full message
                        fullMessageBuilder.Append(update.ContentUpdate);
                        
                        // Format response as SSE (Server-Sent Events) in the exact format expected by the frontend
                        var responseData = new
                        {
                            choices = new[]
                            {
                                new
                                {
                                    delta = new
                                    {
                                        content = update.ContentUpdate
                                    }
                                }
                            }
                        };
                        
                        string jsonData = System.Text.Json.JsonSerializer.Serialize(responseData);
                        await Response.WriteAsync($"data: {jsonData}\n\n");
                        await Response.Body.FlushAsync();
                        _logger.LogDebug("Sent chunk: {ChunkSize} characters", update.ContentUpdate?.Length ?? 0);
                    }
                }

                // End the stream with the [DONE] marker expected by the frontend
                await Response.WriteAsync("data: [DONE]\n\n");
                await Response.Body.FlushAsync();
                
                _logger.LogInformation("Completed streaming response with message: " + 
                    (fullMessageBuilder.Length > 100 
                        ? fullMessageBuilder.ToString().Substring(0, 100) + "..." 
                        : fullMessageBuilder.ToString()));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in streaming chat API route: {ErrorMessage}", ex.Message);
                
                // Try to send a better error response
                try
                {
                    Response.StatusCode = 500;
                    var errorResponse = new { error = ex.Message, stackTrace = ex.StackTrace };
                    string jsonError = System.Text.Json.JsonSerializer.Serialize(errorResponse);
                    await Response.WriteAsync($"data: {jsonError}\n\n");
                    await Response.Body.FlushAsync();
                    await Response.WriteAsync("data: [DONE]\n\n");
                    await Response.Body.FlushAsync();
                }
                catch (Exception innerEx) 
                {
                    _logger.LogError(innerEx, "Failed to send error response: {ErrorMessage}", innerEx.Message);
                }
            }
        }

        [HttpGet("test")]
        [EnableCors("AllowFrontend")]
        public IActionResult Test()
        {
            return Ok(new { message = "Backend API is working correctly!", apiKey = _configuration["OpenAI:ApiKey"]?.Substring(0, 10) + "..." });
        }
    }
} 