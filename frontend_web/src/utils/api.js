import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://vscode-internal-042242-beta.beta01.cloud.kavia.ai:3001';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sessionToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', { credentials });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('sessionToken');
    return response.data;
  },
  getSession: async () => {
    const response = await api.get('/api/session');
    return response.data;
  },
};

export const projects = {
  getAll: async (params) => {
    const response = await api.get('/api/projects', { params });
    return response.data;
  },
  getDetails: async (projectKey) => {
    const response = await api.get(`/api/projects/${projectKey}`);
    return response.data;
  },
  getStatistics: async (projectKey) => {
    const response = await api.get(`/api/projects/${projectKey}/statistics`);
    return response.data;
  },
  exportData: async (projectKey, format = 'csv') => {
    const response = await api.get(`/api/projects/${projectKey}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
