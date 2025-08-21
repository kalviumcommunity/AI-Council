import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    IoPersonOutline,
    IoSettingsOutline,
    IoSchoolOutline,
    IoLocationOutline,
    IoCashOutline,
    IoClipboardOutline,
    IoMenuOutline,
    IoCloseOutline
} from 'react-icons/io5';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../utils/useAuth';
import { preferencesAPI, handleAPIError } from '../services/api';

const Profile = () => {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    // Handle ESC key to close mobile sidebar
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [sidebarOpen]);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const response = await preferencesAPI.get();
            setPreferences(response.data.preferences);
        } catch (error) {
            console.error('Error loading preferences:', error);
            setError(handleAPIError(error));
        } finally {
            setLoading(false);
        }
    };

    const formatBudgetRange = (budgetRange) => {
    if (!budgetRange) return 'Not specified';
    const min = budgetRange.min || 0;
    const max = budgetRange.max || 0;
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    };

    const formatTestScores = (testScores) => {
        if (!testScores) return 'None provided';
        const scores = [];
        if (testScores.sat) scores.push(`SAT: ${testScores.sat}`);
        if (testScores.toefl) scores.push(`TOEFL: ${testScores.toefl}`);
        if (testScores.ielts) scores.push(`IELTS: ${testScores.ielts}`);
        if (testScores.gre) scores.push(`GRE: ${testScores.gre}`);
        return scores.length > 0 ? scores.join(', ') : 'None provided';
    };

    const formatStudyLevel = (level) => {
        const levels = {
            'undergraduate': "Bachelor's Degree",
            'graduate': "Master's Degree",
            'doctorate': 'PhD/Doctorate',
            'certificate': 'Certificate Program'
        };
        return levels[level] || 'Not specified';
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                {/* Mobile Header with Hamburger Menu */}
                <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {sidebarOpen ? <IoCloseOutline className="w-6 h-6" /> : <IoMenuOutline className="w-6 h-6" />}
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
                    <div className="w-10 h-10"></div> {/* Spacer for centering */}
                </div>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar Component */}
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 ease-in-out`}>
                    <Sidebar onNavigate={() => setSidebarOpen(false)} />
                </div>

                <div className="flex-1 flex items-center justify-center pt-16 lg:pt-0">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Header with Hamburger Menu */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {sidebarOpen ? <IoCloseOutline className="w-6 h-6" /> : <IoMenuOutline className="w-6 h-6" />}
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
                <div className="w-10 h-10"></div> {/* Spacer for centering */}
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Component */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 ease-in-out`}>
                <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
                <div className="max-w-4xl mx-auto p-4 sm:p-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
                        {/* NextStep AI Brand - Desktop Only */}
                        <div className="hidden lg:block absolute top-4 right-4">
                            <div className="text-sm font-medium text-gray-600">NextStep AI</div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center sm:mx-0 sm:mr-6">
                                <IoPersonOutline className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>  
                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                                    {user?.name || 'Welcome User'}
                                </h1>
                                <p className="text-gray-600 mt-1 text-sm sm:text-base">{user?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Preferences Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Your Preferences</h2>
                            <Link
                                to="/preferences"
                                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                            >
                                <IoSettingsOutline className="w-4 h-4" />
                                <span>Update Preferences</span>
                            </Link>
                        </div>

                        {preferences ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                {/* Academic Interests */}
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoSchoolOutline className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Academic Interests</h3>
                                    </div>
                                    <p className="text-gray-700 text-xs sm:text-sm">
                                        {Array.isArray(preferences.academicInterests) 
                                            ? preferences.academicInterests.join(', ') 
                                            : preferences.academicInterests || 'Not specified'}
                                    </p>
                                </div>

                                {/* Study Level */}
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoClipboardOutline className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Study Level</h3>
                                    </div>
                                    <p className="text-gray-700 text-xs sm:text-sm">
                                        {formatStudyLevel(preferences.studyLevel)}
                                    </p>
                                </div>

                                {/* Preferred Countries */}
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoLocationOutline className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Preferred Countries</h3>
                                    </div>
                                    <p className="text-gray-700 text-xs sm:text-sm">
                                        {Array.isArray(preferences.preferredCountries) 
                                            ? preferences.preferredCountries.join(', ') 
                                            : preferences.preferredCountries || 'Not specified'}
                                    </p>
                                </div>

                                {/* Budget Range */}
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoCashOutline className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Budget Range</h3>
                                    </div>
                                    <p className="text-gray-700 text-xs sm:text-sm">
                                        {formatBudgetRange(preferences.budgetRange)}
                                    </p>
                                </div>

                                {/* Test Scores */}
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg lg:col-span-2">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoClipboardOutline className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Test Scores</h3>
                                    </div>
                                    <p className="text-gray-700 text-xs sm:text-sm">
                                        {formatTestScores(preferences.testScores)}
                                    </p>
                                </div>

                                {/* Additional Requirements */}
                                {preferences.additionalRequirements && (
                                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg lg:col-span-2">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <IoClipboardOutline className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">Additional Requirements</h3>
                                        </div>
                                        <p className="text-gray-700 text-xs sm:text-sm">
                                            {preferences.additionalRequirements}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6 sm:py-8">
                                <IoSchoolOutline className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No preferences set yet</h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-4 px-2">
                                    Set up your preferences to get personalized university recommendations
                                </p>
                                <Link
                                    to="/preferences"
                                    className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                                >
                                    <IoSettingsOutline className="w-4 h-4" />
                                    <span>Set Up Preferences</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* NextStep AI Footer */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-xs sm:text-sm text-gray-500">
                            Powered by <span className="font-semibold text-gray-700">NextStep AI</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;