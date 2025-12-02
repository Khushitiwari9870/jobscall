import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method, InternalAxiosRequestConfig } from 'axios';
import { ListQueryParams, PaginatedResponse } from './types';

// Define types for API resources
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface EmailRecipient {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface Folder {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills?: string[];
  experience?: number;
  created_at: string;
  updated_at: string;
}

interface FolderProfile {
  id: string;
  folder: string;
  profile: string;
  created_at: string;
}

interface EmailSendPayload {
  template_id: string;
  recipients: string[];
  subject?: string;
  variables?: Record<string, unknown>;
}

// Extend AxiosRequestConfig to include _retry flag
interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1`
      : 'http://localhost:8000/api/v1'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (token) {
      // Create new headers object to avoid mutating the original
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: {
    config?: RetryConfig;
    response?: {
      status: number;
      data: unknown;
    };
    message?: string;
  }) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        if (!refreshToken) {
          // Redirect to login if no refresh token
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(new Error('No refresh token available'));
        }

        // Try to refresh the token
        const response = await axios.post<{ access: string; refresh?: string }>(
          `${process.env.NEXT_PUBLIC_API_URL || '' || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8000` : 'http://localhost:8000')}/api/v1/auth/jwt/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;

        // Store the new token
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', access);
        }

        // Update the Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        } else {
          originalRequest.headers = {
            Authorization: `Bearer ${access}`
          };
        }
        // Retry the original request
        return apiClient(originalRequest);
      } catch (error) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Generic request function with proper TypeScript types
 * @template T - Expected response type
 * @template D - Request data type (optional)
 */
export const apiRequest = async <T, D = unknown>(
  method: Method,
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient<D, AxiosResponse<T>>({
      method,
      url,
      data,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      const apiError = new Error(errorMessage) as Error & { status?: number; details?: unknown };
      apiError.status = error.response?.status;
      apiError.details = error.response?.data;
      throw apiError;
    }
    throw error;
  }
};

// Email Templates API
export const emailTemplatesApi = {
  list: (params?: ListQueryParams) =>
    apiRequest<PaginatedResponse<EmailTemplate>>('get', '/email-templates/', undefined, { params }),
  create: (data: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) =>
    apiRequest<EmailTemplate>('post', '/email-templates/', data),
  retrieve: (id: string) =>
    apiRequest<EmailTemplate>('get', `/email-templates/${id}/`),
  update: (id: string, data: Partial<EmailTemplate>) =>
    apiRequest<EmailTemplate>('put', `/email-templates/${id}/`, data),
  partialUpdate: (id: string, data: Partial<EmailTemplate>) =>
    apiRequest<EmailTemplate>('patch', `/email-templates/${id}/`, data),
  destroy: (id: string) =>
    apiRequest<void>('delete', `/email-templates/${id}/`),
};

// Email Sending API
export const emailSendingApi = {
  send: (data: EmailSendPayload) => apiRequest<void>('post', '/email-send/', data),
};

// Email Recipients API
export const emailRecipientsApi = {
  list: (params?: ListQueryParams) =>
    apiRequest<PaginatedResponse<EmailRecipient>>('get', '/email-recipients/', undefined, { params }),
};

// Folders API
export const foldersApi = {
  list: (params?: ListQueryParams) =>
    apiRequest<PaginatedResponse<Folder>>('get', '/folders/', undefined, { params }),
  create: (data: Omit<Folder, 'id' | 'created_at' | 'updated_at'>) =>
    apiRequest<Folder>('post', '/folders/', data),
  retrieve: (id: string) =>
    apiRequest<Folder>('get', `/folders/${id}/`),
  update: (id: string, data: Partial<Folder>) =>
    apiRequest<Folder>('put', `/folders/${id}/`, data),
  partialUpdate: (id: string, data: Partial<Folder>) =>
    apiRequest<Folder>('patch', `/folders/${id}/`, data),
  destroy: (id: string) =>
    apiRequest<void>('delete', `/folders/${id}/`),
  addProfiles: (id: string, profileIds: string[]) =>
    apiRequest<void>('post', `/folders/${id}/add-profiles/`, { profile_ids: profileIds }),
  moveProfiles: (sourceId: string, targetId: string, profileIds: string[]) =>
    apiRequest<void>('post', `/folders/${sourceId}/move-profiles/`, {
      target_folder: targetId,
      profile_ids: profileIds
    }),
};

// Folder Profiles API
export const folderProfilesApi = {
  list: (params?: ListQueryParams) =>
    apiRequest<PaginatedResponse<FolderProfile>>('get', '/folder-profiles/', undefined, { params }),
  create: (data: Omit<FolderProfile, 'id' | 'created_at'>) =>
    apiRequest<FolderProfile>('post', '/folder-profiles/', data),
  retrieve: (id: string) =>
    apiRequest<FolderProfile>('get', `/folder-profiles/${id}/`),
  update: (id: string, data: Partial<FolderProfile>) =>
    apiRequest<FolderProfile>('put', `/folder-profiles/${id}/`, data),
  partialUpdate: (id: string, data: Partial<FolderProfile>) =>
    apiRequest<FolderProfile>('patch', `/folder-profiles/${id}/`, data),
  destroy: (id: string) =>
    apiRequest<void>('delete', `/folder-profiles/${id}/`),
};

// Immediate Available Profiles API
export const immediateAvailableApi = {
  listProfiles: (params?: ListQueryParams) =>
    apiRequest<PaginatedResponse<Profile>>('get', '/immediate-available/', undefined, { params }),
  retrieveProfile: (id: string) =>
    apiRequest<Profile>('get', `/immediate-available/${id}/`),
};

// Export all APIs
export const api = {
  emailTemplates: emailTemplatesApi,
  emailSending: emailSendingApi,
  emailRecipients: emailRecipientsApi,
  folders: foldersApi,
  folderProfiles: folderProfilesApi,
  immediateAvailable: immediateAvailableApi,
};

export default apiClient;
