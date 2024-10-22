import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const sessionToken = localStorage.getItem('sessionToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (sessionToken) {
    config.headers['X-Session-Token'] = sessionToken;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionToken');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;