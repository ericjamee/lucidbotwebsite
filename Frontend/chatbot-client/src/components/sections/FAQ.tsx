import React, { useState } from 'react';

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-200">
      <button
        className="flex justify-between items-center w-full py-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-neutral-900">{question}</span>
        <span>
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="pb-6">
          <p className="text-neutral-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Can I use this with my Wix/Shopify/WordPress site?",
      answer: "Yes, absolutely! Our chatbot solution integrates seamlessly with all major website platforms including Wix, Shopify, WordPress, Squarespace, and custom-built websites. We provide simple embedding instructions for each platform.",
    },
    {
      question: "How do you train the chatbot on my specific content?",
      answer: "We train your chatbot using your website content, PDFs, documents, FAQ sheets, or any other text-based content you provide. Our AI processes this information to create a knowledge base specific to your business. You can also provide guidelines about your brand's tone and specific responses to common questions.",
    },
    {
      question: "What happens after installation?",
      answer: "After installation, your chatbot begins assisting your website visitors immediately. We monitor its performance and can make adjustments as needed. Regular updates to its knowledge base are included in your plan. You'll also receive access to analytics showing usage patterns and common questions.",
    },
    {
      question: "Will the chatbot actually sound like a human?",
      answer: "Our AI chatbots are designed to provide helpful, conversational responses that feel natural. While they won't perfectly mimic human conversation, they're sophisticated enough to understand context, provide relevant answers, and maintain a conversation flow that feels helpful and engaging.",
    },
    {
      question: "How long does it take to set up?",
      answer: "The typical setup time is 1-2 weeks from initial consultation to going live. This includes the time needed to collect your content, train the AI model, customize the appearance, and integrate it with your website. For more complex deployments or extensive training materials, it may take slightly longer.",
    },
    {
      question: "Can I make changes to the chatbot after it's installed?",
      answer: "Yes, we offer ongoing maintenance and updates as part of our monthly service. You can provide new content, request adjustments to responses, or change the visual design. For the Pro and Custom plans, these changes can be made more frequently.",
    },
  ];

  return (
    <div id="faq" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">FAQ</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-600 lg:mx-auto">
            Answers to common questions about our AI chatbot service
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-neutral-600">
            Still have questions? Feel free to contact us directly.
          </p>
          <div className="mt-4">
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 