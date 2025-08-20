import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    IoArrowBack, 
    IoSchoolOutline,
    IoGridOutline,
    IoPersonOutline
} from 'react-icons/io5';

const Sidebar = ({ backTo = "/", onNavigate }) => {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLinkClick = () => {
        if (onNavigate) {
            onNavigate();
        }
    };

    return (
        <div className="w-16 lg:w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 h-full">
            {/* Back arrow */}
            <Link to={backTo} className="mb-8" onClick={handleLinkClick}>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <IoArrowBack className="w-5 h-5 text-black" />
                </div>
            </Link>

            {/* Vertically centered navigation icons */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                {/* Dashboard icon */}
                <Link to="/dashboard" onClick={handleLinkClick}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        isActive('/dashboard') 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-black'
                    }`}>
                        <IoGridOutline className="w-5 h-5" />
                    </div>
                </Link>

                {/* Recommendations icon */}
                <Link to="/recommendation" onClick={handleLinkClick}>
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
            <Link to="/profile" onClick={handleLinkClick}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isActive('/profile') 
                        ? 'bg-gray-600 text-white' 
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}>
                    <IoPersonOutline className="w-5 h-5" />
                </div>
            </Link>
        </div>
    );
};

export default Sidebar;
