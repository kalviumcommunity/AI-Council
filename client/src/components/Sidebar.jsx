import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    IoArrowBack, 
    IoSchoolOutline,
    IoGridOutline
} from 'react-icons/io5';

const Sidebar = ({ backTo = "/" }) => {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path;
    };

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
                {/* Dashboard icon */}
                <Link to="/dashboard">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        isActive('/dashboard') 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-black'
                    }`}>
                        <IoGridOutline className="w-5 h-5" />
                    </div>
                </Link>

                {/* Recommendations icon */}
                <Link to="/recommendation">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        isActive('/recommendation') 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-black'
                    }`}>
                        <IoSchoolOutline className="w-5 h-5" />
                    </div>
                </Link>
            </div>

            {/* Profile avatar */}
            <Link to="/profile">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isActive('/profile') 
                        ? 'bg-gray-600 text-white' 
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}>
                    <span className="text-sm font-medium">U</span>
                </div>
            </Link>
        </div>
    );
};

export default Sidebar;
