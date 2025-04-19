import React, { useState, useEffect } from 'react';

const Contact: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Set the current URL when the component mounts
    // Use the exact contact section URL to prevent scrolling to demo
    setCurrentUrl(window.location.origin + window.location.pathname + "#contact");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    // Add no-scroll class to prevent auto-scrolling
    document.documentElement.classList.add('no-scroll');
    
    // Remove it after form submission is complete
    setTimeout(() => {
      document.documentElement.classList.remove('no-scroll');
    }, 500);
  };

  return (
    <div id="contact" className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Contact</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Get In Touch
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-600 lg:mx-auto">
            Ready to improve your website with an AI chatbot? Contact us or schedule a consultation.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-soft rounded-xl overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Send Us a Message</h3>
              
              <form action="https://formsubmit.co/je7erickson@gmail.com" method="POST" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-neutral-700">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      required
                      className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  {/* FormSubmit hidden fields */}
                  <input type="hidden" name="_subject" value="New Contact Form Submission" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_next" value={currentUrl} />
                  <input type="hidden" name="_autoresponse" value="Thank you for your message! We'll get back to you as soon as possible." />
                  <input type="hidden" name="_template" value="table" />
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div className="bg-white shadow-soft rounded-xl overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Schedule a Consultation</h3>
              <p className="text-neutral-600 mb-6">
                Book a 30-minute consultation to discuss how our AI chatbot can benefit your business.
              </p>
              
              <div className="mt-8">
                <h4 className="font-medium text-lg text-neutral-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <p className="flex items-center text-neutral-700">
                    <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    je7erickson@gmail.com
                  </p>
                  <p className="flex items-center text-neutral-700">
                    <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    (541) 908-6020
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 