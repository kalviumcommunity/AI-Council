import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Preferences API calls
export const preferencesAPI = {
  save: (preferences) => api.post('/preferences', preferences),
  get: () => api.get('/preferences'),
  update: (preferences) => api.put('/preferences', preferences),
};

// Universities API calls
export const universitiesAPI = {
  getRecommendations: () => api.get('/universities/recommendations'),
  search: (query) => api.get(`/universities/search?q=${query}`),
  getDetails: (id) => api.get(`/universities/${id}`),
};

// Chat API calls
export const chatAPI = {
  sendMessage: (message) => api.post('/chat/message', { message }),
  getHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history'),
};

export default api;
