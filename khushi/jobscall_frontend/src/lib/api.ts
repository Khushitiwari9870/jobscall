// src/lib/api.ts
import axios from 'axios';
import { WalkInJobData } from '@/types/global';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1`
    : 'http://localhost:8000/api/v1');

const api = axios.create({
  baseURL: API_BASE,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const postWalkIn = async (data: WalkInJobData) => {
  return api.post('/recruiter/post-walkin/', data);
};

export default api;