import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { preferencesAPI, recommendationsAPI, handleAPIError } from '../services/api';

const Preferences = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    academicInterests: [],
    preferredCountries: [],
    budgetRange: { min: 0, max: 100000 },
    studyLevel: '',
    testScores: {
      sat: '',
      toefl: '',
      ielts: '',
      gre: ''
    },
    preferredUniversitySize: 'any',
    additionalRequirements: ''
  });

  // Load existing preferences when component mounts
  useEffect(() => {
    loadExistingPreferences();
  }, []);

  const loadExistingPreferences = async () => {
    try {
      const response = await preferencesAPI.get();
      if (response.data.preferences) {
        const prefs = response.data.preferences;
        setFormData({
          academicInterests: prefs.academicInterests || [],
          preferredCountries: prefs.preferredCountries || [],
          budgetRange: prefs.budgetRange || { min: 0, max: 100000 },
          studyLevel: prefs.studyLevel || '',
          testScores: prefs.testScores || {
            sat: '',
            toefl: '',
            ielts: '',
            gre: ''
          },
          preferredUniversitySize: prefs.preferredUniversitySize || 'any',
          additionalRequirements: prefs.additionalRequirements || ''
        });
      }
    } catch {
      // If no preferences exist yet, that's fine - use default values
      console.log('No existing preferences found, using defaults');
    }
  };

  const steps = [
    {
      title: 'Academic Interest',
      component: AcademicInterestStep
    },
    {
      title: 'Study Level',
      component: StudyLevelStep
    },
    {
      title: 'Location',
      component: LocationStep
    },
    {
      title: 'Budget & Scores',
      component: BudgetScoresStep
    }
  ];

  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Transform academic interests from string to array if needed
      const preferences = {
        ...formData,
        academicInterests: Array.isArray(formData.academicInterests) 
          ? formData.academicInterests 
          : formData.academicInterests.split(',').map(item => item.trim()).filter(Boolean),
        preferredCountries: Array.isArray(formData.preferredCountries) 
          ? formData.preferredCountries 
          : formData.preferredCountries.split(',').map(item => item.trim()).filter(Boolean),
        testScores: {
          sat: formData.testScores.sat ? parseInt(formData.testScores.sat) : undefined,
          toefl: formData.testScores.toefl ? parseInt(formData.testScores.toefl) : undefined,
          ielts: formData.testScores.ielts ? parseFloat(formData.testScores.ielts) : undefined,
          gre: formData.testScores.gre ? parseInt(formData.testScores.gre) : undefined,
        }
      };

      await preferencesAPI.save(preferences);
      
      // Generate initial recommendations
      try {
        const prefsResponse = await preferencesAPI.get();
        if (prefsResponse.data.preferences) {
          await recommendationsAPI.generate(prefsResponse.data.preferences._id);
        }
      } catch {
        console.log('Initial recommendation generation will happen later');
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="absolute top-8 left-8">
        <h1 className="text-xl font-semibold text-gray-900">NextStep AI</h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Preference Details</h2>
            
            {/* Progress Indicators */}
            <div className="flex justify-center space-x-4 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                    index <= currentStep 
                      ? index === currentStep 
                        ? 'bg-gray-800' 
                        : 'bg-gray-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            <h3 className="text-xl font-medium text-gray-900 mb-6">
              {steps[currentStep].title}
            </h3>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">
            <CurrentStepComponent 
              formData={formData}
              updateFormData={updateFormData}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IoArrowBackOutline className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>
                {currentStep === totalSteps - 1 
                  ? loading ? 'Saving...' : 'Complete'
                  : 'Next'
                }
              </span>
              {currentStep < totalSteps - 1 && <IoArrowForwardOutline className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Academic Interest Step Component
const AcademicInterestStep = ({ formData, updateFormData }) => {
  const academicFields = [
    'Computer Science', 'Engineering', 'Business', 'Medicine', 'Law',
    'Arts & Design', 'Psychology', 'Education', 'Mathematics', 'Physics',
    'Chemistry', 'Biology', 'Economics', 'Literature', 'History'
  ];

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter your academic interests (comma-separated)"
        value={Array.isArray(formData.academicInterests) 
          ? formData.academicInterests.join(', ') 
          : formData.academicInterests}
        onChange={(e) => updateFormData('academicInterests', e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
        {academicFields.map((field) => (
          <button
            key={field}
            type="button"
            onClick={() => {
              const current = Array.isArray(formData.academicInterests) 
                ? formData.academicInterests 
                : formData.academicInterests.split(',').map(item => item.trim()).filter(Boolean);
              
              if (current.includes(field)) {
                updateFormData('academicInterests', current.filter(item => item !== field));
              } else {
                updateFormData('academicInterests', [...current, field]);
              }
            }}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              (Array.isArray(formData.academicInterests) 
                ? formData.academicInterests 
                : formData.academicInterests.split(',').map(item => item.trim())
              ).includes(field)
                ? 'bg-gray-800 border-gray-800 text-white'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {field}
          </button>
        ))}
      </div>
    </div>
  );
};

// Study Level Step Component
const StudyLevelStep = ({ formData, updateFormData }) => {
  const studyLevels = [
    { value: 'undergraduate', label: 'Undergraduate (Bachelor\'s)' },
    { value: 'graduate', label: 'Graduate (Master\'s)' },
    { value: 'doctorate', label: 'Doctorate (PhD)' },
    { value: 'certificate', label: 'Certificate Program' }
  ];

  return (
    <div className="space-y-3">
      {studyLevels.map((level) => (
        <label
          key={level.value}
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
            formData.studyLevel === level.value
              ? 'border-gray-800 bg-gray-100'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <input
            type="radio"
            name="studyLevel"
            value={level.value}
            checked={formData.studyLevel === level.value}
            onChange={(e) => updateFormData('studyLevel', e.target.value)}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
            formData.studyLevel === level.value
              ? 'border-gray-800 bg-gray-800'
              : 'border-gray-300'
          }`}>
            {formData.studyLevel === level.value && (
              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
            )}
          </div>
          <span className="text-gray-900">{level.label}</span>
        </label>
      ))}
    </div>
  );
};

// Location Step Component
const LocationStep = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter preferred countries (comma-separated)"
        value={Array.isArray(formData.preferredCountries) 
          ? formData.preferredCountries.join(', ') 
          : formData.preferredCountries}
        onChange={(e) => updateFormData('preferredCountries', e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
      />
      <p className="text-sm text-gray-500">
        Examples: United States, United Kingdom, Canada, Australia, Germany
      </p>
    </div>
  );
};

// Budget & Scores Step Component
const BudgetScoresStep = ({ formData, updateFormData }) => {
  const updateBudgetRange = (field, value) => {
    updateFormData('budgetRange', {
      ...formData.budgetRange,
      [field]: parseInt(value) || 0
    });
  };

  const updateTestScore = (field, value) => {
    updateFormData('testScores', {
      ...formData.testScores,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Budget Range (USD per year)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Minimum</label>
            <input
              type="number"
              placeholder="0"
              value={formData.budgetRange.min}
              onChange={(e) => updateBudgetRange('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Maximum</label>
            <input
              type="number"
              placeholder="100000"
              value={formData.budgetRange.max}
              onChange={(e) => updateBudgetRange('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Test Scores */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Test Scores (Optional)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">SAT (400-1600)</label>
            <input
              type="number"
              placeholder="1200"
              min="400"
              max="1600"
              value={formData.testScores.sat}
              onChange={(e) => updateTestScore('sat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">TOEFL (0-120)</label>
            <input
              type="number"
              placeholder="100"
              min="0"
              max="120"
              value={formData.testScores.toefl}
              onChange={(e) => updateTestScore('toefl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">IELTS (0-9)</label>
            <input
              type="number"
              placeholder="7.5"
              min="0"
              max="9"
              step="0.5"
              value={formData.testScores.ielts}
              onChange={(e) => updateTestScore('ielts', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">GRE (260-340)</label>
            <input
              type="number"
              placeholder="320"
              min="260"
              max="340"
              value={formData.testScores.gre}
              onChange={(e) => updateTestScore('gre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
