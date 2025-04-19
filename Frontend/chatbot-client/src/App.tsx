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
    // Force scroll to top on initial load
    window.history.scrollRestoration = 'manual';
    
    // Remove hash completely from URL
    if (window.location.hash) {
      // Change URL without hash and without adding to history
      window.history.replaceState(
        '', 
        document.title, 
        window.location.pathname + window.location.search
      );
    }
    
    // Force scroll to top
    window.scrollTo(0, 0);
    
    // Apply scroll to top multiple times to ensure it works
    const scrollInterval = setInterval(() => {
      window.scrollTo(0, 0);
    }, 50);
    
    // Clear interval after 500ms
    setTimeout(() => {
      clearInterval(scrollInterval);
      // Add loaded class to enable smooth scrolling for subsequent navigation
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
