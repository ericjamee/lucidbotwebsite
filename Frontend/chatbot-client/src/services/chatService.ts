import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

// Define types for our chat messages
export interface ChatMessage {
  role: string;
  content: string;
}

// Extended message with optional metadata
export interface ExtendedChatMessage extends ChatMessage {
  name?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const chatService = {
  /**
   * Send a message to the AI chat service
   * @param messages Array of message objects with role and content
   * @param options Optional configuration options
   * @returns Promise with the assistant's response
   */
  sendMessage: async (
    messages: ChatMessage[], 
    options?: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
    }
  ): Promise<string> => {
    try {
      const requestData: ChatRequest = {
        messages,
        model: options?.model || API_CONFIG.OPENAI.MODEL,
        temperature: options?.temperature || API_CONFIG.OPENAI.TEMPERATURE,
        max_tokens: options?.max_tokens || API_CONFIG.OPENAI.MAX_TOKENS
      };
      
      const response = await axios.post<ChatResponse>(
        `${API_CONFIG.BACKEND_API_URL}/api/chat`, 
        requestData
      );
      
      return response.data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('API error details:', error.response.data);
        throw new Error(`API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  },
  
  /**
   * Stream a message response from the AI chat service
   * @param messages Array of message objects
   * @param onChunk Callback function for each chunk of the response
   * @param onComplete Callback function when the response is complete
   * @param options Optional configuration
   */
  streamMessage: async (
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: (fullMessage: string) => void,
    options?: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
    }
  ): Promise<void> => {
    try {
      console.log("Starting stream request with", messages.length, "messages");
      const requestData: ChatRequest = {
        messages,
        model: options?.model || API_CONFIG.OPENAI.MODEL,
        temperature: options?.temperature || API_CONFIG.OPENAI.TEMPERATURE,
        max_tokens: options?.max_tokens || API_CONFIG.OPENAI.MAX_TOKENS
      };
      
      console.log("Sending streaming request to:", `${API_CONFIG.BACKEND_API_URL}/api/chat/stream`);
      
      // For streaming, we'll use fetch with proper handling of server-sent events
      const response = await fetch(`${API_CONFIG.BACKEND_API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(requestData)
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Stream request failed:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      
      if (!response.body) {
        console.error("Response body is null");
        throw new Error('Response body is null');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = '';
      let buffer = '';
      
      const processChunks = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log("Stream completed");
              onComplete(fullMessage);
              break;
            }
            
            // Decode the chunk and add it to our buffer
            const text = decoder.decode(value);
            console.log("Received chunk:", text.length, "characters");
            buffer += text;
            
            // Process any complete SSE messages in the buffer
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || ''; // Keep the last incomplete chunk in the buffer
            
            for (const line of lines) {
              if (line.trim() === '') continue;
              
              const dataLine = line.split('\n').find(l => l.startsWith('data: '));
              if (!dataLine) {
                console.log("Non-data line:", line);
                continue;
              }
              
              const data = dataLine.substring(6); // Remove 'data: ' prefix
              
              // Check if it's the [DONE] message
              if (data === '[DONE]') {
                console.log("Received [DONE] message");
                continue;
              }
              
              try {
                const parsed = JSON.parse(data);
                
                // Check if it's an error response
                if (parsed.error) {
                  console.error("Server returned error:", parsed.error);
                  throw new Error(`Server error: ${parsed.error}`);
                }
                
                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                  const textChunk = parsed.choices[0].delta.content;
                  fullMessage += textChunk;
                  onChunk(textChunk);
                }
              } catch (e) {
                console.warn("Failed to parse chunk:", data, e);
              }
            }
          }
        } catch (error) {
          console.error("Error in processChunks:", error);
          throw error;
        }
      };
      
      await processChunks();
    } catch (error) {
      console.error("Error in streamMessage:", error);
      throw error;
    }
  }
};

export default chatService; 