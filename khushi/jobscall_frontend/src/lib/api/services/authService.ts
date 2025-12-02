import { apiRequest } from '../apiClient';
import { apiEndpoints } from '../endpoints';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  // Add other user fields as needed
}

export interface RegisterData {
  email: string;
  password: string;
  password2: string;  // For password confirmation
  first_name: string;
  last_name: string;
  user_type: 'candidate' | 'recruiter';  // User type
}

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('post', apiEndpoints.login, credentials);
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    return apiRequest<{ access: string }>('post', apiEndpoints.refreshToken, {
      refresh: refreshToken,
    });
  },

  verifyToken: async (token: string): Promise<{ token: string }> => {
    return apiRequest('post', apiEndpoints.jwtVerify, { token });
  },

  getProfile: async (): Promise<UserProfile> => {
    return apiRequest<UserProfile>('get', apiEndpoints.userMe);
  },

  // User registration
  register: async (userData: RegisterData): Promise<void> => {
    return apiRequest('post', apiEndpoints.register, userData);
  },
  
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    return apiRequest<UserProfile>('patch', apiEndpoints.profile, profileData);
  },

  changePassword: async (passwordData: PasswordChangeData): Promise<void> => {
    return apiRequest('post', apiEndpoints.changePassword, passwordData);
  },

  // Other auth-related methods
};
