import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-primary-50">
      <div className="absolute inset-0 bg-gradient-radial from-primary-100/30 to-transparent opacity-70"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-neutral-900 sm:text-5xl md:text-6xl">
            <span className="block">Embed Smart AI Chatbots</span>
            <span className="block text-primary-600">on Your Website</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-neutral-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Custom-built assistants that boost conversions, handle FAQs, and work 24/7
          </p>
          <div className="mt-10 sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              <a
                href="#demo"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 md:py-4 md:text-lg md:px-10"
              >
                Get a Demo
              </a>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <a
                href="#how-it-works"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero; 