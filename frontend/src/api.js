import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moodsense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: (payload) => api.post('/auth/signup', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
};

export const profileApi = {
  get: () => api.get('/profile'),
  update: (payload) => api.put('/profile', payload),
};

export const logsApi = {
  create: (payload) => api.post('/log-data', payload),
};

export const moodApi = {
  today: () => api.get('/today'),
  mood7: () => api.get('/mood/7days'),
  mood30: () => api.get('/mood/30days'),
  predict: () => api.get('/predict-next-day'),
  insights: () => api.get('/ai-insights'),
  depression: () => api.get('/depression-analysis'),
};

export const connectionApi = {
  search: (email) => api.get('/connections/search', { params: { email } }),
  request: (payload) => api.post('/connections/request', payload),
  respond: (payload) => api.post('/connections/request/respond', payload),
  list: () => api.get('/connections'),
};

export const locationApi = {
  search: (params) => api.get('/location-search', { params }),
};
