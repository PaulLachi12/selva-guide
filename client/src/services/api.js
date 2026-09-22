import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      const authUrls = ['/auth/login', '/auth/registro'];
      const esAuth = authUrls.some((u) => url.includes(u));
      if (!esAuth) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    return Promise.reject(err);
  }
);

export default api;