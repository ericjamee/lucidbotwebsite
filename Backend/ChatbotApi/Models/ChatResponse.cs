using System.Text.Json.Serialization;

namespace ChatbotApi.Models
{
    public class ChatResponse
    {
        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;
        public ChatUsage Usage { get; set; }
    }

    public class ChatUsage
    {
        public int PromptTokens { get; set; }
        public int CompletionTokens { get; set; }
        public int TotalTokens { get; set; }
    }
} 