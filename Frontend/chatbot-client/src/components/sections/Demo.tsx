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
  },
  realestate: {
    name: 'Real Estate',
    theme: {
      primary: 'from-sky-600 to-cyan-500',
      secondary: 'bg-sky-600',
      icon: '🏠',
      bgColor: 'bg-sky-50',
      headerColor: 'bg-sky-600'
    },
    samplePrompts: [
      'What areas do you serve?',
      'How do I schedule a viewing?',
      'What documents do I need to apply?'
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
    <div id="demo" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Try It Now</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Live Demo
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-600 lg:mx-auto">
            See how a custom AI chatbot would work for different types of businesses. Select an industry to experience a tailored chatbot.
          </p>
        </div>

        <div className="mt-10 mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(industryConfigs).map(([id, config]) => (
              <button
                key={id}
                onClick={() => handleIndustryChange(id as IndustryId)}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  selectedIndustry === id
                    ? `bg-gradient-to-r ${config.theme.primary} text-white shadow-md scale-105`
                    : 'bg-white text-neutral-700 hover:bg-gray-100 hover:scale-105 border border-gray-200'
                }`}
              >
                <span className="mr-2">{config.theme.icon}</span>
                {config.name}
              </button>
            ))}
          </div>
        </div>

        <div 
          ref={chatContainerRef}
          className={`max-w-4xl mx-auto rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform
            ${isAnimating ? 'opacity-30 scale-95' : 'opacity-100 scale-100'} bg-white border border-gray-200`}
        >
          <div className={`${activeTheme.headerColor} text-white p-4 flex items-center justify-between transition-colors duration-300`}>
            <div className="flex items-center">
              <span className="text-xl mr-2">{activeTheme.icon}</span>
              <h3 className="font-bold">{industryConfigs[selectedIndustry].name} Chat Assistant</h3>
            </div>
            <div className="flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-white bg-opacity-30"></div>
              <div className="h-3 w-3 rounded-full bg-white bg-opacity-50"></div>
              <div className="h-3 w-3 rounded-full bg-white bg-opacity-70"></div>
            </div>
          </div>
          
          <div className={`${activeTheme.bgColor} h-[500px] bg-white flex flex-col`}>
            <ChatInterface 
              theme={activeTheme} 
              industryType={selectedIndustry} 
              ref={chatInterfaceRef}
            />
          </div>
          
          <div className={`bg-white border-t border-gray-200 p-4`}>
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {industryConfigs[selectedIndustry].samplePrompts.map((prompt: string, index: number) => (
                <button
                  key={index}
                  className={`text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors sample-prompt-btn border border-gray-200`}
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-neutral-600 mb-4">
            Want a customized chatbot for your specific business needs?
          </p>
          <div>
            <a
              href="#pricing"
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-gradient-to-r ${activeTheme.primary} hover:opacity-90 transition-opacity`}
            >
              Get Your Custom Chatbot
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo; 