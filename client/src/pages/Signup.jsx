import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useAuth } from '../utils/useAuth';
import signupCover from '../assets/auth-cover.jpg';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('Please agree to the terms & policy');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await signup(formData);
      
      if (result.success) {
        // New user always goes to preferences form
        navigate('/preferences');
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again.');
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

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
            <p className="text-gray-600 text-xs sm:text-sm">
              Have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image - Hidden on small screens for better mobile experience */}
      <div className="hidden lg:block w-full lg:w-1/2 relative overflow-hidden lg:min-h-screen">
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
