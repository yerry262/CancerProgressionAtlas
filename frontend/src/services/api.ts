import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Large file uploads need their own instance with no timeout — a 500 MB DICOM
// upload on a slow connection can take several minutes.
export const uploadApi = axios.create({
  baseURL: BASE_URL,
  timeout: 0,
});

// Attach JWT + session token to both instances
function applyAuthInterceptor(instance: typeof api) {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('cpa_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const sessionToken = localStorage.getItem('cpa_session');
    if (sessionToken) config.headers['x-session-token'] = sessionToken;

    return config;
  });

  instance.interceptors.response.use(
    (r) => r,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('cpa_token');
        localStorage.removeItem('cpa_user');
      }
      return Promise.reject(err);
    }
  );
}

applyAuthInterceptor(api);
applyAuthInterceptor(uploadApi);

export default api;
