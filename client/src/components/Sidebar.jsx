import React from 'react';
import { Link } from 'react-router-dom';
import { 
    IoArrowBack, 
    IoChatbubbleEllipsesOutline, 
    IoSchoolOutline
} from 'react-icons/io5';

const Sidebar = ({ backTo = "/" }) => {
    return (
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6">
            {/* Back arrow */}
            <Link to={backTo} className="mb-8">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                    <IoArrowBack className="w-5 h-5 text-black" />
                </div>
            </Link>

            {/* Vertically centered navigation icons */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                {/* Chat icon */}
                <Link to="/chat">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
                        <IoChatbubbleEllipsesOutline className="w-5 h-5 text-black" />
                    </div>
                </Link>

                {/* Recommendations icon */}
                <Link to="/dashboard">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
                        <IoSchoolOutline className="w-5 h-5 text-black" />
                    </div>
                </Link>
            </div>

            {/* Profile avatar */}
            <Link to="/profile">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
                    <span className="text-white text-sm font-medium">U</span>
                </div>
            </Link>
        </div>
    );
};

export default Sidebar;
