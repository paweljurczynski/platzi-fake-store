import axios, { AxiosError } from 'axios';
import { storage } from '../utils/storage';
import { config } from '../config/constants';

export const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.clearTokens();
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
    return Promise.reject(error);
  }
);

