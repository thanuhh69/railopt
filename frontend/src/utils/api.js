import axios from 'axios';

// Detect production API URL from VITE_API_BASE_URL or fallback to local proxy
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('railopt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
