import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Extended Axios config interface to include retry property
interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1`
    : 'http://localhost:8000/api/v1');

// Create axios instance with base URL and common headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    // Skip adding token for token refresh and auth endpoints
    if (config.url?.includes('jwt/refresh') || 
        config.url?.includes('jwt/create') || 
        config.url?.includes('users/')) {
      return config;
    }
    
    // Add token for other requests
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;
    
    // If the error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_URL}/auth/jwt/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        
        // Store the new access token
        localStorage.setItem('access_token', access);
        
        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export const login = async (email: string, password: string): Promise<User> => {
  const response = await api.post('/login/', { email, password });
  const { access, refresh } = response.data as Tokens;

  // Store tokens in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  // Get user data
  const userResponse = await api.get('/users/me/');
  return userResponse.data as User;
};

export const register = async (data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<User> => {
  // Register the user
  await api.post('/register/', {
    ...data,
    password2: data.password,
    user_type: 'candidate'
  });

  // Auto-login after registration
  return login(data.email, data.password);
};

export const logout = async (): Promise<void> => {
  try {
    // Try to revoke the refresh token on the server
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await api.post('/logout/', { refresh: refreshToken });
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always clear tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get('/users/me/');
    return response.data as User;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await api.post('/password-reset/', { email });
};

export const resetPassword = async (uid: string, token: string, newPassword: string): Promise<void> => {
  await api.post('/password-reset-confirm/', {
    uid,
    token,
    new_password: newPassword,
    re_new_password: newPassword,
  });
};
