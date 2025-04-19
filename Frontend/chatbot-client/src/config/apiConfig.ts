// API Configuration
export const API_CONFIG = {
  // Base URL for your backend API
  BACKEND_API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // OpenAI configuration
  OPENAI: {
    MODEL: 'gpt-4o-mini', // Default model to use
    MAX_TOKENS: 800, // Max tokens per response - increased for more comprehensive responses
    TEMPERATURE: 0.8, // Controls randomness (0-1) - slightly increased for more creative responses
  }
};

// Default system instructions
export const DEFAULT_INSTRUCTIONS = 'You are a helpful AI assistant for Lucid Bot. Provide accurate, concise, and friendly responses. Highlight key points with **bold text** and use *italics* for emphasis.'; 