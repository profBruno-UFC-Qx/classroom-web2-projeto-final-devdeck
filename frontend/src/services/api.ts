import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// --- Request Interceptor ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devdeck_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { api };