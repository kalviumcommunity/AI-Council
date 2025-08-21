import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { 
    IoSchoolOutline, 
    IoLocationOutline,
    IoCashOutline,
    IoTimeOutline,
    IoStarOutline,
    IoGlobeOutline,
    IoReloadOutline,
    IoMenuOutline,
    IoCloseOutline
} from 'react-icons/io5';
import Sidebar from '../components/Sidebar';
import { recommendationsAPI, preferencesAPI, handleAPIError, universityAPI } from '../services/api';

const Recommendation = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [savedUniversities, setSavedUniversities] = useState(new Set());
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState('');
    const [modalDetails, setModalDetails] = useState('');
    const [modalUniversity, setModalUniversity] = useState('');
    // Fetch university details and open modal
    const handleMoreInfo = async (universityName) => {
        setModalOpen(true);
        setModalLoading(true);
        setModalError('');
        setModalDetails('');
        setModalUniversity(universityName);
        try {
            const response = await universityAPI.getDetails(universityName);
            setModalDetails(response.data.details);
        } catch (err) {
            setModalError(handleAPIError(err));
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        loadRecommendations();
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

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            const response = await recommendationsAPI.getAll();
            const apiRecommendations = response.data.recommendations || [];
            
            setRecommendations(apiRecommendations);
        } catch (error) {
            console.error('Error loading recommendations:', error);
            setError(handleAPIError(error));
            
            // ...existing code...
        } finally {
            setLoading(false);
        }
    };

    const loadPreferences = async () => {
        try {
            const response = await preferencesAPI.get();
            setPreferences(response.data.preferences);
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    };

    const generateNewRecommendations = async () => {
        if (!preferences) {
            setError('Please set your preferences first');
            return;
        }

        try {
            setGenerating(true);
            setError('');
            await recommendationsAPI.generate(preferences._id);
            await loadRecommendations(); // Reload the list
        } catch (error) {
            console.error('Error generating recommendations:', error);
            setError(handleAPIError(error));
        } finally {
            setGenerating(false);
        }
    };

    const toggleSaveUniversity = (universityId) => {
        const newSaved = new Set(savedUniversities);
        if (newSaved.has(universityId)) {
            newSaved.delete(universityId);
        } else {
            newSaved.add(universityId);
        }
        setSavedUniversities(newSaved);
    };

    const formatCurrency = (amount) => {
    // Always show rupee symbol and format as INR
    return `₹${amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    };

    const getUniversityDuration = (studyLevel) => {
        switch (studyLevel) {
            case 'undergraduate': return '4 years';
            case 'graduate': return '2 years';
            case 'doctorate': return '4-6 years';
            case 'certificate': return '6-12 months';
            default: return '2-4 years';
        }
    };

    const filteredRecommendations = recommendations;

    const allUniversities = filteredRecommendations.flatMap(rec => rec.universities || []);

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
                    <h1 className="text-lg font-semibold text-gray-900">Recommendations</h1>
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
                        <p className="text-gray-600">Loading your recommendations...</p>
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
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    {sidebarOpen ? <IoCloseOutline className="w-6 h-6" /> : <IoMenuOutline className="w-6 h-6" />}
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Recommendations</h1>
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
            <div className="flex-1 flex flex-col pt-16 lg:pt-0">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4 sm:p-6 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">University Recommendations</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                {allUniversities.length} universities match your preferences
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={generateNewRecommendations}
                                disabled={generating || !preferences}
                                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                            >
                                <IoReloadOutline className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                                <span>{generating ? 'Generating...' : 'Generate New'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel removed */}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Recommendations Grid */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                    {allUniversities.length === 0 ? (
                        <div className="text-center py-12">
                            <IoSchoolOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                            <p className="text-gray-600 mb-4">
                                {preferences ? 'Generate your first set of recommendations' : 'Please complete your preferences first'}
                            </p>
                            {preferences ? (
                                <button
                                    onClick={generateNewRecommendations}
                                    disabled={generating}
                                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {generating ? 'Generating...' : 'Generate Recommendations'}
                                </button>
                            ) : (
                                <Link
                                    to="/preferences"
                                    className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                    Complete Preferences
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {allUniversities.map((university, index) => (
                                <div key={`${university.name}-${index}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                                    <div className="p-4 sm:p-6">
                                        {/* University Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <IoSchoolOutline className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">{university.name}</h3>
                                                    {university.ranking && (
                                                        <div className="flex items-center space-x-1 mt-1">
                                                            <IoStarOutline className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                                                            <span className="text-xs sm:text-sm text-gray-600">Ranked #{university.ranking}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Favourite icon removed */}
                                        </div>

                                        {/* University Image */}
                                        <div className="relative mb-4">
                                            <img 
                                                src={university.imageUrl || `https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center&q=80`} 
                                                alt={`${university.name} campus`}
                                                className="w-full h-32 sm:h-40 object-cover rounded-xl"
                                                onError={(e) => {
                                                    console.log(`Image failed for ${university.name}: ${e.target.src}`);
                                                    // First fallback: Try a different university image
                                                    if (e.target.src.includes('unsplash.com/photo-1562774053')) {
                                                        e.target.src = 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop&crop=center&q=80';
                                                    } else if (e.target.src.includes('unsplash.com/photo-1583847268964')) {
                                                        // Second fallback: Generic campus image
                                                        e.target.src = 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&h=600&fit=crop&crop=center&q=80';
                                                    } else {
                                                        // Final fallback: Academic building
                                                        e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center&q=80';
                                                    }
                                                }}
                                                onLoad={(e) => {
                                                    if (university.imageUrl && !e.target.src.includes('unsplash.com')) {
                                                        console.log(`Successfully loaded AI-provided image for ${university.name}`);
                                                    }
                                                }}
                                                loading="lazy"
                                            />
                                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-xs text-gray-700 font-medium">
                                                        {university.fitScore || 85}% match
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                                                <div className="flex items-center space-x-1 sm:space-x-2">
                                                    <IoLocationOutline className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                                                    <span className="text-xs sm:text-sm text-gray-700">
                                                        {university.location?.city}, {university.location?.country}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* University Details */}
                                        <div className="space-y-3">
                                            {/* Cost per year */}
                                            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <IoCashOutline className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                    <span className="text-xs sm:text-sm font-medium text-gray-700">Cost per year</span>
                                                </div>
                                                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                                                    {university.tuitionRange?.min && university.tuitionRange?.max 
                                                        ? `${formatCurrency(university.tuitionRange.min)} - ${formatCurrency(university.tuitionRange.max)}`
                                                        : formatCurrency(university.tuitionRange?.max || 45000)
                                                    }
                                                </span>
                                            </div>

                                            {/* Duration */}
                                            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <IoTimeOutline className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                                                    <span className="text-xs sm:text-sm font-medium text-gray-700">Duration</span>
                                                </div>
                                                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                                                    {getUniversityDuration(preferences?.studyLevel)}
                                                </span>
                                            </div>

                                            {/* Programs */}
                                            {university.programs && university.programs.length > 0 && (
                                                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <IoGlobeOutline className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                                                        <span className="text-xs sm:text-sm font-medium text-gray-700">Programs</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {university.programs.slice(0, 3).map((program, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                                {program}
                                                            </span>
                                                        ))}
                                                        {university.programs.length > 3 && (
                                                            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                                                +{university.programs.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Why it's a good fit */}
                                            <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                                                <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">Why it's a good fit</h4>
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3">{university.reasons || "Great match for your academic interests and career goals."}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-4 flex flex-col gap-2">
                                            {university.website ? (
                                                <a
                                                    href={university.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full block px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium text-center cursor-pointer"
                                                >
                                                    Visit Website
                                                </a>
                                            ) : (
                                                <button className="w-full px-3 sm:px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-xs sm:text-sm font-medium">
                                                    Website Not Available
                                                </button>
                                            )}
                                            <button
                                                className="w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
                                                onClick={() => handleMoreInfo(university.name)}
                                            >
                                                More Info
                                            </button>
                                        </div>
            {/* University Details Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative border border-gray-200">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => setModalOpen(false)}
                        >
                            <IoCloseOutline className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-semibold mb-2 text-gray-900">{modalUniversity} - Details</h2>
                        {modalLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"></div>
                                <span className="ml-3 text-black">Fetching details...</span>
                            </div>
                        ) : modalError ? (
                            <div className="text-red-600 py-4">{modalError}</div>
                        ) : (
                            <div className="py-2 text-gray-800 text-sm prose max-w-none overflow-y-auto" style={{maxHeight: '50vh', overflowX: 'auto'}}>
                                <ReactMarkdown
                                    children={modalDetails.replace(/^```[\s\S]*?\n|```$/g, '')}
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({node, inline, className, children, ...props}) {
                                            return !inline ? (
                                                <pre className={className + " overflow-x-auto bg-gray-100 rounded p-2 text-sm"} {...props}><code>{children}</code></pre>
                                            ) : (
                                                <code className={className + " bg-gray-100 rounded px-1"} {...props}>{children}</code>
                                            );
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recommendation;