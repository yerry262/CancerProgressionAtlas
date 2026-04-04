import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cpa_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const sessionToken = localStorage.getItem('cpa_session');
  if (sessionToken) config.headers['x-session-token'] = sessionToken;

  return config;
});

// On 401, clear auth and redirect to login
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cpa_token');
      localStorage.removeItem('cpa_user');
    }
    return Promise.reject(err);
  }
);

export default api;
