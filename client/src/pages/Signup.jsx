import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import signupCover from '../assets/auth-cover.jpg';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      alert('Please agree to the terms & policy');
      return;
    }
    
    setLoading(true);
    
    // TODO: Implement signup logic with backend
    try {
      console.log('Signup attempt:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Redirect to preferences after signup
      navigate('/preferences');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Signup Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-8 lg:py-0">
        {/* Back arrow */}
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
          <Link 
            to="/" 
            className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
          >
            <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </Link>
        </div>

        {/* NextStep AI branding */}
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">NextStep AI</h2>
        </div>

        <div className="max-w-sm mx-auto w-full mt-12 sm:mt-16 lg:mt-0">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">Get Started Now</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm"
                placeholder="Create a password"
              />
            </div>

            <div className="flex items-start space-x-2 py-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-3.5 h-3.5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 mt-0.5"
              />
              <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700 leading-4">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 underline">
                  terms & policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-200 text-gray-800 py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Creating account...' : 'Signup'}
            </button>
          </form>

          <div className="mt-4 sm:mt-5 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">or</p>
          </div>

          <div className="mt-3 sm:mt-4">
            <button className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center text-sm">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="mt-4 sm:mt-5 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              Have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[40vh] lg:min-h-screen">
        <img 
          src={signupCover}
          alt="Graduation ceremony"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 text-white">
          <p className="text-lg sm:text-xl font-light leading-relaxed">
            The right guidance shapes not just choices,<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>but the journey that turns them into opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
