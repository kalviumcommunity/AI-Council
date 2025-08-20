import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    IoSchoolOutline, 
    IoLocationOutline,
    IoReloadOutline
} from 'react-icons/io5';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';
import { recommendationsAPI, handleAPIError } from '../services/api';

const Dashboard = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            const response = await recommendationsAPI.getAll();
            const apiRecommendations = response.data.recommendations || [];
            
            // If no recommendations from API, provide fallback mock data for testing
            if (apiRecommendations.length === 0 || apiRecommendations.every(rec => !rec.universities || rec.universities.length === 0)) {
                console.log('No API recommendations found, using fallback data');
                const mockRecommendations = [{
                    universities: [
                        {
                            name: 'Harvard University',
                            location: { city: 'Cambridge', country: 'United States' },
                            fitScore: 95
                        },
                        {
                            name: 'MIT',
                            location: { city: 'Cambridge', country: 'United States' },
                            fitScore: 92
                        },
                        {
                            name: 'IIT Delhi',
                            location: { city: 'New Delhi', country: 'India' },
                            fitScore: 88
                        }
                    ]
                }];
                setRecommendations(mockRecommendations);
            } else {
                setRecommendations(apiRecommendations);
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
            setError(handleAPIError(error));
        } finally {
            setLoading(false);
        }
    };

    const handlePreferenceChange = () => {
        // Reload recommendations when preferences change through chat
        loadRecommendations();
    };

    // Get the latest recommendations and extract universities
    const latestRecommendation = recommendations.length > 0 ? recommendations[0] : null;
    const universities = latestRecommendation?.universities || [];

    // Show only the first 3 universities with name and location
    const displayUniversities = universities.slice(0, 3);

    return (
        <div className="flex h-screen bg-gradient-to-r from-gray-100 to-purple-100">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex">
                {/* Recommendations Section */}
                <div className="w-1/3 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-normal text-gray-900">Recommendations</h1>
                        <Link 
                            to="/recommendation"
                            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-600 text-sm mb-4">{error}</p>
                            <button
                                onClick={loadRecommendations}
                                className="flex items-center space-x-2 mx-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <IoReloadOutline className="w-4 h-4" />
                                <span>Retry</span>
                            </button>
                        </div>
                    ) : displayUniversities.length === 0 ? (
                        <div className="text-center py-8">
                            <IoSchoolOutline className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                            <p className="text-gray-600 mb-4">Complete your preferences to get started</p>
                            <Link
                                to="/preferences"
                                className="inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Set Preferences
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayUniversities.map((university, index) => (
                                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-shadow">
                                    <div className="p-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <IoSchoolOutline className="w-5 h-5 text-black" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                                    {university.name}
                                                </h3>
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <IoLocationOutline className="w-3 h-3 text-gray-500" />
                                                    <span className="text-xs text-gray-600">
                                                        {university.location?.city}, {university.location?.country}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <img 
                                                src={`https://images.unsplash.com/photo-${index % 2 === 0 ? '1562516155-e0c1ee44059b' : '1583847268964-b28dc8f51f92'}?w=400&h=120&fit=crop`} 
                                                alt={university.name}
                                                className="w-full h-24 object-cover rounded-xl"
                                            />
                                            {university.fitScore && (
                                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                                                    <div className="flex items-center space-x-1">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-xs text-gray-700 font-medium">
                                                            {university.fitScore}% match
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {universities.length > 3 && (
                                <Link
                                    to="/recommendation"
                                    className="block w-full p-4 text-center bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all"
                                >
                                    <span className="text-sm text-gray-600">
                                        +{universities.length - 3} more recommendations
                                    </span>
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Chat Interface */}
                <div className="w-2/3 bg-gray-50 border-l border-gray-200 border-opacity-60">
                    <ChatInterface 
                        isCompact={true} 
                        onPreferenceChange={handlePreferenceChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
