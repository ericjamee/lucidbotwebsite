import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import ChatMessage from './ChatMessage';
import chatService, { ChatMessage as MessageType } from '../services/chatService';
import { IndustryId, IndustryTheme } from '../types/chatTypes';
import { API_CONFIG } from '../config/apiConfig';

// Define industry-specific system messages
const INDUSTRY_SYSTEM_MESSAGES: Record<IndustryId, string> = {
  general: 'You are a helpful assistant for a general business called Lucid Bot. Provide information about our products, services, and support options. Be friendly and professional. Use **bold text** for important information and *italics* for emphasis.',
  
  coach: 'You are a friendly assistant for Lucid Bot coaching/consulting business. Help potential clients understand our coaching services, methodologies, and scheduling. Be empathetic and supportive. Use **bold text** for key benefits and *italics* for program names.',
  
  restaurant: 'You are a helpful assistant for a restaurant using Lucid Bot. Provide information about our menu items, operating hours, reservations, and dining options. Be friendly and inviting. Use **bold text** for specials and *italics* for dish names.',
  
  ecommerce: 'You are a helpful assistant for Lucid Bot e-commerce store. Provide information about our products, shipping policies, returns, and customer service. Be helpful and solution-oriented. Use **bold text** for promotions and *italics* for product names.',
  
  realestate: 'You are a helpful assistant for a Lucid Bot real estate agency. Provide information about our listings, viewing processes, application requirements, and market trends. Be knowledgeable and professional. Use **bold text** for property features and *italics* for location names.'
};

interface ChatInterfaceProps {
  theme?: IndustryTheme;
  industryType?: IndustryId;
  useStreaming?: boolean;
}

const ChatInterface = forwardRef<any, ChatInterfaceProps>(({ 
  theme = { 
    primary: 'from-primary-600 to-secondary-600', 
    secondary: 'bg-primary-600',
    icon: '💬',
    bgColor: 'bg-gray-50',
    headerColor: 'bg-primary-600'
  },
  industryType = 'general',
  useStreaming = true
}, ref) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Get the appropriate system message based on industry type
  const systemMessage: MessageType = {
    role: 'system',
    content: INDUSTRY_SYSTEM_MESSAGES[industryType] || INDUSTRY_SYSTEM_MESSAGES.general
  };

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => {
      if (text && text.trim()) {
        setInputValue(text);
        setTimeout(() => {
          if (inputRef.current) {
            const form = inputRef.current.form;
            if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
          }
        }, 100);
      }
    },
    focusInput: () => {
      inputRef.current?.focus();
    }
  }));

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Reset messages when industry changes
  useEffect(() => {
    setMessages([]);
    setStreamingMessage('');
  }, [industryType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent default form submission behavior to avoid page scrolling
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!inputValue.trim()) return;
    
    const userMessage: MessageType = {
      role: 'user',
      content: inputValue
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Prepare messages array with system message
      const messageHistory = [
        systemMessage,
        ...messages.filter(msg => msg.role !== 'system'),
        userMessage
      ];
      
      if (useStreaming) {
        // Clear any previous streaming message
        setStreamingMessage('');
        
        // Add a placeholder for the streaming response
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: '' } // This will be updated as we stream
        ]);
        
        // Start streaming
        await chatService.streamMessage(
          messageHistory,
          (chunk: string) => {
            // Update the streaming message with each new chunk
            setStreamingMessage(prev => prev + chunk);
          },
          (fullMessage: string) => {
            // When streaming is complete, update the messages array
            setMessages(prev => {
              const updatedMessages = [...prev];
              updatedMessages[updatedMessages.length - 1] = {
                role: 'assistant',
                content: fullMessage
              };
              return updatedMessages;
            });
            setStreamingMessage('');
            setIsLoading(false);
          },
          {
            model: API_CONFIG.OPENAI.MODEL,
            temperature: API_CONFIG.OPENAI.TEMPERATURE,
            max_tokens: API_CONFIG.OPENAI.MAX_TOKENS
          }
        );
      } else {
        // Use regular non-streaming approach
        const response = await chatService.sendMessage(messageHistory);
        
        // Add assistant response
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', content: response }
        ]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again later.' 
        }
      ]);
      setIsLoading(false);
      setStreamingMessage('');
    }
  };

  // Handle keydown events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent form submission on Enter key to avoid page scroll
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = inputRef.current?.form;
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full" ref={chatContainerRef}>
      <div 
        className="flex-1 p-4 overflow-y-auto relative"
        ref={messagesContainerRef}
      >
        <div className="w-full max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 my-16">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 max-w-md">
                <div className={`h-14 w-14 ${theme.secondary} bg-opacity-10 rounded-full mb-4 mx-auto flex items-center justify-center`}>
                  <span className="text-2xl">{theme.icon}</span>
                </div>
                <p className="mb-2 text-center font-medium text-gray-700">Hi! I'm your virtual assistant.</p>
                <p className="text-center text-sm text-gray-600">Ask me anything about our products and services.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {messages.map((msg, index) => {
                // Skip system messages
                if (msg.role === 'system') return null;
                
                // If this is the last message and it's from the assistant and we're streaming
                const isLastAssistantMessage = index === messages.length - 1 && msg.role === 'assistant';
                const shouldShowStreaming = isLastAssistantMessage && streamingMessage && isLoading;
                
                return (
                  <ChatMessage 
                    key={index} 
                    message={{
                      ...msg,
                      // If we're streaming, show the streaming content for the last assistant message
                      content: shouldShowStreaming ? streamingMessage : msg.content
                    }} 
                    theme={theme} 
                  />
                );
              })}
              
              {isLoading && !streamingMessage && (
                <div className="flex justify-start my-2">
                  <div className={`${theme.secondary} bg-opacity-10 px-4 py-3 rounded-lg rounded-tl-none`}>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      
      <div className="border-t border-gray-200 bg-white">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto p-4"
        >
          <div className="flex items-center bg-white rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-opacity-40 focus-within:border-transparent focus-within:ring-primary-500 shadow-sm">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none text-gray-700 chat-input"
              disabled={isLoading}
              ref={inputRef}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className={`bg-gradient-to-r ${theme.primary} m-1 px-4 py-2 rounded-lg text-white flex items-center justify-center hover:opacity-90 focus:outline-none disabled:opacity-50 transition-all shadow-sm`}
              disabled={isLoading || !inputValue.trim()}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ChatInterface; 