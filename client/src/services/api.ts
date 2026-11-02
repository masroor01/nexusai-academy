import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const apiBase = rawBaseUrl
  ? (rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/+$/, '')}/api`)
  : '/api';

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject bearer token if present in localStorage (fallback for mobile/strict cross-origin)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for session expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      // Clear token if expired
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
    }
    return Promise.reject(error);
  }
);

export default api;
