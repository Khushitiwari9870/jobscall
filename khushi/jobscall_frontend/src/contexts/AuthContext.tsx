'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services/authService';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name?: string;  // Computed full name
  role?: string;  // Added optional role property
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    user_type: 'candidate' | 'recruiter';
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const userProfile = await authService.getProfile();
          setUser({
            id: userProfile.id.toString(),
            email: userProfile.email,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            name: `${userProfile.first_name} ${userProfile.last_name}`.trim(),
          });
        }
      } catch (error) {
        console.error('Failed to authenticate', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Call the auth service to log in
      const response = await authService.login({ email, password });
      
      // Store the tokens in localStorage
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      
      // Use user data from login response if available, otherwise fetch profile
      let userData;
      if (response.user) {
        userData = response.user;
      } else {
        // Fallback: Get the user profile separately
        userData = await authService.getProfile();
      }
      
      // Set the user data in state
      setUser({
        id: userData.id.toString(),
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        name: `${userData.first_name} ${userData.last_name}`.trim(),
      });
      
      // Login successful - the calling component will handle the redirect
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to allow error handling in the UI
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    user_type: 'candidate' | 'recruiter';
  }) => {
    try {
      setLoading(true);
      
      // Send registration request to the API
      await authService.register({
        ...userData,
        password2: userData.password2 || userData.password, // Use password2 if provided, otherwise use password
      });
      
      // Automatically log the user in after successful registration
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // Re-throw to allow error handling in the UI
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear authentication tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Reset user state and redirect to login
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedUser } : null);
  };

  // Context value containing user data and auth methods
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  // Always render children, let individual components handle loading state
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * Provides access to the authentication context
 * Must be used within an AuthProvider
 * @returns {AuthContextType} The authentication context
 * @throws {Error} If used outside of an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}