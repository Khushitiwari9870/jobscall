import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { APIError } from './types/errors';

// Extend the AxiosRequestConfig to include _retry flag
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

type ApiRequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

import { API_CONFIG } from '@/config/api';

// Create axios instance with base URL and default headers
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or cookie
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);


// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.config || !error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryConfig;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token using the axios instance so baseURL and proxying
        // behavior are respected. Use the relative path for the refresh endpoint.
        const response = await axiosInstance.post('/v1/auth/jwt/refresh/', {
          refresh: refreshToken,
        });

        const { access } = response.data;

        // Store the new token
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', access);
        }

        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    // Handle other errors
    if (error.response) {
      const status = error.response.status;
      const responseData = error.response?.data as { message?: string } | string | undefined;
      const message = (typeof responseData === 'object' ? responseData?.message : responseData) || error.message || 'An error occurred';

      console.error(`API Error (${status}):`, message);

      // Handle specific status codes
      if (status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }

      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.message);
      throw new Error('Network Error: Could not connect to the server');
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
      throw error;
    }
  }
);

// Generic request function
export const apiRequest = async <T = unknown, D = unknown>(
  method: ApiRequestMethod,
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: APIError = {
        name: 'APIError',
        message: (error.response?.data as { message?: string })?.message || error.message,
        status: error.response?.status || 500,
        data: error.response?.data,
      };
      throw apiError;
    } else if (error instanceof Error) {
      // For non-Axios errors, wrap them in a generic APIError
      const genericError: APIError = {
        name: 'APIError',
        message: error.message,
        status: 500,
      };
      throw genericError;
    } else {
      // For completely unknown error types
      const unknownError: APIError = {
        name: 'APIError',
        message: 'An unknown error occurred',
        status: 500,
      };
      throw unknownError;
    }
  }
};

export default axiosInstance;
