import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Preferences = () => {
  const [formData, setFormData] = useState({
    studyField: '',
    studyLevel: '',
    budget: '',
    location: '',
    specialRequirements: '',
    careerGoals: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const studyFields = [
    'Computer Science', 'Engineering', 'Business', 'Medicine', 'Law',
    'Arts & Design', 'Psychology', 'Education', 'Mathematics', 'Physics',
    'Chemistry', 'Biology', 'Economics', 'Literature', 'History'
  ];

  const studyLevels = [
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD/Doctorate',
    'Certificate Program',
    'Diploma'
  ];

  const budgetRanges = [
    'Under $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    'Above $100,000'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Save preferences to backend
    try {
      console.log('Preferences submitted:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Redirect to dashboard with recommendations
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tell Us About Your Goals</h1>
          <p className="text-xl text-gray-600">
            Help us personalize your university recommendations by sharing your preferences
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Study Field */}
            <div>
              <label htmlFor="studyField" className="block text-lg font-medium text-gray-700 mb-3">
                What field do you want to study?
              </label>
              <select
                id="studyField"
                name="studyField"
                value={formData.studyField}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a field of study</option>
                {studyFields.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            {/* Study Level */}
            <div>
              <label htmlFor="studyLevel" className="block text-lg font-medium text-gray-700 mb-3">
                What level of study are you looking for?
              </label>
              <select
                id="studyLevel"
                name="studyLevel"
                value={formData.studyLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select study level</option>
                {studyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-lg font-medium text-gray-700 mb-3">
                What's your budget range per year?
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select budget range</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-3">
                Preferred location or country
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., United States, Europe, Online, etc."
              />
            </div>

            {/* Career Goals */}
            <div>
              <label htmlFor="careerGoals" className="block text-lg font-medium text-gray-700 mb-3">
                What are your career goals?
              </label>
              <textarea
                id="careerGoals"
                name="careerGoals"
                value={formData.careerGoals}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Tell us about your career aspirations and what you hope to achieve..."
              />
            </div>

            {/* Special Requirements */}
            <div>
              <label htmlFor="specialRequirements" className="block text-lg font-medium text-gray-700 mb-3">
                Any special requirements or preferences?
              </label>
              <textarea
                id="specialRequirements"
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., campus size, research opportunities, internships, etc."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding your perfect matches...
                </div>
              ) : (
                'Get My Recommendations'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
