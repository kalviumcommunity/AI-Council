import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import { preferencesAPI } from '../services/api';

const ProtectedRoute = ({ children, requiresPreferences = false }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [hasPreferences, setHasPreferences] = useState(null);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkPreferences = async () => {
      if (isAuthenticated && requiresPreferences) {
        try {
          const response = await preferencesAPI.get();
          setHasPreferences(!!response.data.preferences);
        } catch {
          // No preferences found
          setHasPreferences(false);
        } finally {
          setPreferencesLoading(false);
        }
      } else {
        setPreferencesLoading(false);
      }
    };

    if (!authLoading) {
      checkPreferences();
    }
  }, [isAuthenticated, requiresPreferences, authLoading]);

  // Show loading while checking authentication or preferences
  if (authLoading || (requiresPreferences && preferencesLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to preferences if required and not set
  if (requiresPreferences && hasPreferences === false) {
    return <Navigate to="/preferences" replace />;
  }

  // Allow access to protected route
  return children;
};

export default ProtectedRoute;
