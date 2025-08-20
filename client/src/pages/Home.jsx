import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient"></div>
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-4 sm:p-6 lg:px-12">
          <div className="text-white">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">NextStep AI</h2>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              // Authenticated user navigation
              <>
                <span className="hidden sm:inline text-white text-sm lg:text-base">
                  Welcome, {user.name || user.email}
                </span>
                <button 
                  onClick={logout}
                  className="text-white hover:text-gray-300 transition-colors duration-200 px-2 py-1 sm:px-4 sm:py-2 text-sm lg:text-base"
                >
                  Logout
                </button>
                <Link 
                  to="/dashboard" 
                  className="bg-transparent border-2 border-white text-white px-3 py-1 sm:px-6 sm:py-2 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200 text-sm lg:text-base"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              // Unauthenticated user navigation
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-gray-300 transition-colors duration-200 px-2 py-1 sm:px-4 sm:py-2 text-sm lg:text-base"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-transparent border-2 border-white text-white px-3 py-1 sm:px-6 sm:py-2 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200 text-sm lg:text-base"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-white mb-6 sm:mb-8 leading-tight tracking-tight">
            Guided Futures
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-12 max-w-4xl leading-relaxed font-light px-2">
            The right guidance shapes not just choices,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>but the journey that turns them into opportunities.
          </p>
          {user ? (
            // Authenticated user - show Dashboard button
            <Link 
              to="/dashboard" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            // Unauthenticated user - show Get Started button
            <Link 
              to="/signup" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
