import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    IoPersonOutline,
    IoSettingsOutline,
    IoSchoolOutline,
    IoLocationOutline,
    IoCashOutline,
    IoClipboardOutline
} from 'react-icons/io5';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../utils/useAuth';
import { preferencesAPI, handleAPIError } from '../services/api';

const Profile = () => {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPreferences();
    }, []);

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
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
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
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
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
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                                <IoPersonOutline className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900">
                                    {user?.name || 'Welcome User'}
                                </h1>
                                <p className="text-gray-600 mt-1">{user?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Preferences Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Your Preferences</h2>
                            <Link
                                to="/preferences"
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <IoSettingsOutline className="w-4 h-4" />
                                <span>Update Preferences</span>
                            </Link>
                        </div>

                        {preferences ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Academic Interests */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoSchoolOutline className="w-5 h-5 text-black" />
                                        <h3 className="font-medium text-gray-900">Academic Interests</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        {Array.isArray(preferences.academicInterests) 
                                            ? preferences.academicInterests.join(', ') 
                                            : preferences.academicInterests || 'Not specified'}
                                    </p>
                                </div>

                                {/* Study Level */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoClipboardOutline className="w-5 h-5 text-black" />
                                        <h3 className="font-medium text-gray-900">Study Level</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        {formatStudyLevel(preferences.studyLevel)}
                                    </p>
                                </div>

                                {/* Preferred Countries */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoLocationOutline className="w-5 h-5 text-black" />
                                        <h3 className="font-medium text-gray-900">Preferred Countries</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        {Array.isArray(preferences.preferredCountries) 
                                            ? preferences.preferredCountries.join(', ') 
                                            : preferences.preferredCountries || 'Not specified'}
                                    </p>
                                </div>

                                {/* Budget Range */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoCashOutline className="w-5 h-5 text-black" />
                                        <h3 className="font-medium text-gray-900">Budget Range</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        {formatBudgetRange(preferences.budgetRange)}
                                    </p>
                                </div>

                                {/* Test Scores */}
                                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <IoClipboardOutline className="w-5 h-5 text-black" />
                                        <h3 className="font-medium text-gray-900">Test Scores</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        {formatTestScores(preferences.testScores)}
                                    </p>
                                </div>

                                {/* Additional Requirements */}
                                {preferences.additionalRequirements && (
                                    <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <IoClipboardOutline className="w-5 h-5 text-black" />
                                            <h3 className="font-medium text-gray-900">Additional Requirements</h3>
                                        </div>
                                        <p className="text-gray-700 text-sm">
                                            {preferences.additionalRequirements}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <IoSchoolOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No preferences set yet</h3>
                                <p className="text-gray-600 mb-4">
                                    Set up your preferences to get personalized university recommendations
                                </p>
                                <Link
                                    to="/preferences"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <IoSettingsOutline className="w-4 h-4" />
                                    <span>Set Up Preferences</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;