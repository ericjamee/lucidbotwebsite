import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Lucid Bot
              </span>
            </div>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <a href="#how-it-works" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600">
              How It Works
            </a>
            <a href="#demo" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600">
              Live Demo
            </a>
            <a href="#features" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600">
              Features
            </a>
            <a href="#pricing" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600">
              Pricing
            </a>
            <a href="#faq" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600">
              FAQ
            </a>
            <a href="#contact" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-primary-600">
              Contact
            </a>
          </div>
          
          <div className="flex items-center">
            <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
              Get Started
            </button>
            
            <div className="-mr-2 flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50">
              How It Works
            </a>
            <a href="#demo" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50">
              Live Demo
            </a>
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50">
              Features
            </a>
            <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50">
              Pricing
            </a>
            <a href="#faq" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50">
              FAQ
            </a>
            <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50">
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 