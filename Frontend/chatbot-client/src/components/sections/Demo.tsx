import React, { useState, useRef } from 'react';
import ChatInterface from '../ChatInterface';
import { IndustryId, IndustryTheme, IndustryConfigs } from '../../types/chatTypes';

// Industry-specific configurations
const industryConfigs: IndustryConfigs = {
  general: {
    name: 'General Business',
    theme: {
      primary: 'from-blue-600 to-indigo-600',
      secondary: 'bg-blue-600',
      icon: '🏢',
      bgColor: 'bg-gray-50',
      headerColor: 'bg-blue-600'
    },
    samplePrompts: [
      'What services do you offer?',
      'How can I contact customer support?',
      'Tell me about your pricing plans'
    ]
  },
  coach: {
    name: 'Coach/Consultant',
    theme: {
      primary: 'from-purple-600 to-pink-500',
      secondary: 'bg-purple-600',
      icon: '🧠',
      bgColor: 'bg-purple-50',
      headerColor: 'bg-purple-600'
    },
    samplePrompts: [
      'Do you offer personal coaching?',
      'How long are your consultation sessions?',
      'What is your coaching methodology?'
    ]
  },
  restaurant: {
    name: 'Restaurant',
    theme: {
      primary: 'from-red-600 to-orange-500',
      secondary: 'bg-red-600',
      icon: '🍽️',
      bgColor: 'bg-orange-50',
      headerColor: 'bg-red-600'
    },
    samplePrompts: [
      'What are your operating hours?',
      'Do you take reservations?',
      'Do you have vegetarian options?'
    ]
  },
  ecommerce: {
    name: 'E-Commerce',
    theme: {
      primary: 'from-green-600 to-teal-500',
      secondary: 'bg-green-600',
      icon: '🛒',
      bgColor: 'bg-green-50',
      headerColor: 'bg-green-600'
    },
    samplePrompts: [
      'What is your return policy?',
      'Do you ship internationally?',
      'How can I track my order?'
    ]
  }
};

const Demo: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryId>('general');
  const [activeTheme, setActiveTheme] = useState<IndustryTheme>(industryConfigs.general.theme);
  const [isAnimating, setIsAnimating] = useState(false);
  const chatInterfaceRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle industry change with animation
  const handleIndustryChange = (industryId: IndustryId): void => {
    if (industryId === selectedIndustry) return;
    
    setIsAnimating(true);
    
    // Add a slight delay for the animation
    setTimeout(() => {
      setSelectedIndustry(industryId);
      setActiveTheme(industryConfigs[industryId].theme);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 150);
  };

  // Handle sample prompt click
  const handlePromptClick = (prompt: string): void => {
    // Access the input field in the ChatInterface component
    const inputElement = document.querySelector('#demo .chat-input') as HTMLInputElement;
    if (inputElement) {
      // Set the value
      inputElement.value = prompt;
      // Dispatch an input event to trigger React's onChange
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent);
      // Focus the input
      inputElement.focus();
      
      // Optional: Automatically submit after a short delay
      setTimeout(() => {
        const form = inputElement.closest('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
      }, 500);
    }
  };

  return (
    <div id="demo" className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Try It Now</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Live Demo
          </p>
          <p className="mt-3 max-w-2xl text-lg text-neutral-600 lg:mx-auto">
            See how a tailored chatbot can work for different industries.
          </p>
        </div>

        <div className="mt-6">
          <div 
            ref={chatContainerRef}
            className={`max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform
              ${isAnimating ? 'opacity-30 scale-95' : 'opacity-100 scale-100'} bg-white border border-gray-200`}
          >
            {/* Chat header with industry selector */}
            <div className={`bg-gradient-to-r ${activeTheme.primary} text-white p-3 transition-colors duration-300`}>
              {/* Two-row layout for mobile, single row for desktop */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                {/* Bot name and controls */}
                <div className="flex items-center mb-2 sm:mb-0">
                  <span className="text-lg mr-2">{industryConfigs[selectedIndustry].theme.icon}</span>
                  <h3 className="font-bold text-sm md:text-base">{industryConfigs[selectedIndustry].name} Chat Assistant</h3>
                  
                  <div className="flex space-x-1 ml-auto sm:hidden">
                    <div className="h-2 w-2 rounded-full bg-white bg-opacity-30"></div>
                    <div className="h-2 w-2 rounded-full bg-white bg-opacity-50"></div>
                    <div className="h-2 w-2 rounded-full bg-white bg-opacity-70"></div>
                  </div>
                </div>
                
                {/* Industry toggle tabs */}
                <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
                  {Object.entries(industryConfigs).map(([id, config]) => (
                    <button
                      key={id}
                      onClick={() => handleIndustryChange(id as IndustryId)}
                      className={`flex items-center whitespace-nowrap px-2 py-1 rounded-full text-xs transition-all ${
                        selectedIndustry === id
                          ? 'bg-white text-blue-600 font-medium shadow-sm'
                          : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                      }`}
                    >
                      <span className="mr-1">{config.theme.icon}</span>
                      <span>{config.name}</span>
                    </button>
                  ))}
                </div>
                
                <div className="hidden sm:flex space-x-1 ml-4">
                  <div className="h-2 w-2 rounded-full bg-white bg-opacity-30"></div>
                  <div className="h-2 w-2 rounded-full bg-white bg-opacity-50"></div>
                  <div className="h-2 w-2 rounded-full bg-white bg-opacity-70"></div>
                </div>
              </div>
            </div>
            
            <div className={`${activeTheme.bgColor} h-[350px] bg-white flex flex-col`}>
              <ChatInterface 
                theme={activeTheme} 
                industryType={selectedIndustry} 
                ref={chatInterfaceRef}
              />
            </div>
            
            <div className={`bg-white border-t border-gray-200 p-3`}>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {industryConfigs[selectedIndustry].samplePrompts.map((prompt: string, index: number) => (
                  <button
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors sample-prompt-btn border border-gray-200`}
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-neutral-600 mb-3 text-sm">
              Want a customized chatbot for your specific business needs?
            </p>
            <div>
              <a
                href="#pricing"
                className={`inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r ${activeTheme.primary} hover:opacity-90 transition-opacity`}
              >
                Get Your Custom Chatbot
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        {`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        `}
      </style>
    </div>
  );
};

export default Demo; 