import React from 'react';
import { ChatMessage as MessageType } from '../services/chatService';
import { IndustryTheme } from '../types/chatTypes';

interface ChatMessageProps {
  message: MessageType;
  theme?: IndustryTheme;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  theme = {
    primary: 'from-primary-600 to-secondary-600',
    secondary: 'bg-primary-600',
    icon: '💬',
    bgColor: 'bg-gray-50',
    headerColor: 'bg-primary-600'
  }
}) => {
  const isUser = message.role === 'user';
  
  // Convert markdown-style formatting to HTML
  const formatContent = (content: string) => {
    // Replace ** ** with bold
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace * * with italic that is not already part of bold
    formattedContent = formattedContent.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    // Replace line breaks with <br> tags
    formattedContent = formattedContent.replace(/\n/g, '<br />');
    
    return formattedContent;
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className={`flex-shrink-0 h-8 w-8 rounded-full ${theme.secondary} bg-opacity-10 flex items-center justify-center mr-2 mt-1`}>
          <span className="text-sm">{theme.icon}</span>
        </div>
      )}
      
      <div 
        className={`px-4 py-3 rounded-lg ${
          isUser 
            ? `bg-gradient-to-r ${theme.primary} text-white rounded-tr-none shadow-md max-w-[80%] sm:max-w-[70%]` 
            : `${theme.secondary} bg-opacity-10 text-gray-800 rounded-tl-none shadow-sm max-w-[80%] sm:max-w-[75%]`
        }`}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }} 
          className="message-content text-sm sm:text-base leading-relaxed"
        />
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden ml-2 mt-1 bg-gray-100">
          <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 