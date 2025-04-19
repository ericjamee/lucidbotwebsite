import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: 'Send Us Your Site',
      description: 'Share your website URL and tell us what kind of assistance you want your AI chatbot to provide.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'We Build & Train Your AI Assistant',
      description: 'Our team develops a custom AI chatbot trained on your content, optimized for your specific needs.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'You Paste the Embed Code',
      description: 'Easily integrate the chatbot with a simple code snippet - or we can handle the integration for you.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Process</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-600 lg:mx-auto">
            Getting your AI chatbot up and running is simple with our streamlined process.
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {steps.map((step) => (
              <div key={step.id} className="relative">
                <div className="group relative bg-white p-6 rounded-lg shadow-soft hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 group-hover:bg-primary-200 transition-colors duration-300 mx-auto">
                    {step.icon}
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center justify-center">
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-500 text-white text-sm font-bold">
                        {step.id}
                      </span>
                      <h3 className="ml-3 text-xl font-medium text-neutral-900">{step.title}</h3>
                    </div>
                    <p className="mt-5 text-base text-center text-neutral-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 