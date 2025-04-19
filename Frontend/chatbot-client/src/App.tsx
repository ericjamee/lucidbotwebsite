import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import HowItWorks from './components/sections/HowItWorks';
import Demo from './components/sections/Demo';
import Features from './components/sections/Features';
import Pricing from './components/sections/Pricing';
import FAQ from './components/sections/FAQ';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';

function App() {
  // Reset scroll position to top on initial load
  useEffect(() => {
    // Force scroll to top on initial page load
    window.history.scrollRestoration = 'manual';
    
    // Remove any hash from URL without triggering a scroll
    if (window.location.hash) {
      // Clear hash without scrolling
      window.location.hash = '';
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }

    // Add 'loaded' class to enable smooth scrolling after initial render
    setTimeout(() => {
      document.documentElement.classList.add('loaded');
    }, 500);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Demo />
        <Features />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
