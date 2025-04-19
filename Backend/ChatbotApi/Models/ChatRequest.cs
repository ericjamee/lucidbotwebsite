using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace ChatbotApi.Models
{
    public class ChatRequest
    {
        [JsonPropertyName("messages")]
        public List<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
        
        // OpenAI configuration parameters
        public string Model { get; set; }
        public int? MaxTokens { get; set; }
        public float? Temperature { get; set; }
    }
} 