import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    IoSchoolOutline, 
    IoLocationOutline,
    IoSettingsOutline,
    IoSendOutline
} from 'react-icons/io5';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const [message, setMessage] = useState('');

    const universities = [
        {
            name: 'Harvard University',
            location: 'Cambridge, Massachusetts',
            image: 'https://images.unsplash.com/photo-1562516155-e0c1ee44059b?w=400&h=200&fit=crop'
        },
        {
            name: 'Oxford University',
            location: 'Oxford, England',
            image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=200&fit=crop'
        }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex">
                {/* Recommendations Section */}
                <div className="w-1/3 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-Normal text-gray-900 items-center">Recommendations</h1>
                        
                    </div>

                    <div className="space-y-6">
                        {universities.map((university, index) => (
                            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                                <div className="p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <IoSchoolOutline className="w-5 h-5 text-black" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{university.name}</h3>
                                    </div>
                                    <div className="relative">
                                        <img 
                                            src={university.image} 
                                            alt={university.name}
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                                            <div className="flex items-center space-x-2">
                                                <IoLocationOutline className="w-4 h-4 text-black" />
                                                <span className="text-sm text-gray-700">{university.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="w-2/3 bg-white border-l border-gray-200 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <IoSettingsOutline className="w-5 h-5 text-black" />
                            </div>
                            <span className="font-medium text-gray-900">NextStep AI</span>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">AI</span>
                            </div>
                            <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                                <p className="text-sm text-gray-800">
                                    Hello.👋 I'm your new friend, NextStep AI. Want help narrowing down universities?
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 justify-end">
                            <div className="bg-gray-800 rounded-2xl px-4 py-3 max-w-xs">
                                <p className="text-sm text-white">
                                    Give me a list of Universities which are near to me.
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">U</span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here"
                                    className="w-full px-4 py-3 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <IoSendOutline className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
