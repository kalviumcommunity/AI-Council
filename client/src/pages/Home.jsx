import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient"></div>
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 lg:px-12">
          <div className="text-white">
            <h2 className="text-2xl font-bold">NextStep AI</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-white hover:text-gray-300 transition-colors duration-200 px-4 py-2"
            >
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
          <h1 className="text-6xl lg:text-8xl font-normal text-white mb-8 leading-tight tracking-tight">
            Guided Futures
          </h1>
          <p className="text-xl lg:text-2xl text-gray-200 mb-12 max-w-4xl leading-relaxed font-light">
            The right guidance shapes not just choices,<br />
            but the journey that turns them into opportunities.
          </p>
          <Link 
            to="/signup" 
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-gray-900 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
