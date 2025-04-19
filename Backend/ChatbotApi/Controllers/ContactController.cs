using Microsoft.AspNetCore.Mvc;
using ChatbotApi.Models;
using Microsoft.Extensions.Configuration;
using System;

namespace ChatbotApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly ILogger<ContactController> _logger;
        private readonly IConfiguration _configuration;

        public ContactController(ILogger<ContactController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult SubmitContact([FromBody] ContactRequest request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrWhiteSpace(request.Name) || 
                    string.IsNullOrWhiteSpace(request.Email) || 
                    string.IsNullOrWhiteSpace(request.Message))
                {
                    return BadRequest("Name, email, and message are required fields");
                }

                // Log the contact request
                _logger.LogInformation($"Contact form submission from: {request.Email}");
                
                // This endpoint is kept for backward compatibility
                // but actual email sending is now handled by FormSubmit
                
                return Ok(new { Success = true, Message = "Thank you for your message! We'll get back to you soon." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing contact form submission");
                return StatusCode(500, "Internal server error");
            }
        }
    }
} 