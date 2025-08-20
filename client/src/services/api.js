import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Preferences API calls
export const preferencesAPI = {
  save: (preferences) => api.post('/preferences', preferences),
  get: () => api.get('/preferences'),
  getById: (id) => api.get(`/preferences/${id}`),
  getAll: () => api.get('/preferences/all'),
  delete: () => api.delete('/preferences'),
};

// Chat API calls
export const chatAPI = {
  sendMessage: (message, preferencesId = null) => 
    api.post('/chat/message', { message, preferencesId }),
  getHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history'),
};

// Recommendations API calls
export const recommendationsAPI = {
  generate: (preferencesId) => api.post('/recommendations/generate', { preferencesId }),
  getAll: (page = 1, limit = 10) => api.get(`/recommendations?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/recommendations/${id}`),
  delete: (id) => api.delete(`/recommendations/${id}`),
  getStats: () => api.get('/recommendations/stats'),
};

// Helper function to handle API errors
export const handleAPIError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;
