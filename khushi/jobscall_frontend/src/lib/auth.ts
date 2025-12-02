import { jwtDecode } from 'jwt-decode';

// Remove server-side only import
// import { cookies } from 'next/headers';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface Tokens {
  access: string;
  refresh: string;
}

// Helper function to store redirect URL
const storeRedirectUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('redirect_after_login', url);
  }
};

// Helper function to get and clear redirect URL
const getAndClearRedirectUrl = (): string | null => {
  if (typeof window !== 'undefined') {
    const redirectUrl = sessionStorage.getItem('redirect_after_login');
    if (redirectUrl) {
      sessionStorage.removeItem('redirect_after_login');
      return redirectUrl;
    }
  }
  return null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1`
    : 'http://localhost:8000/api/v1');

// Cookie functions are not currently used but kept for future reference
// Uncomment and use these functions when needed
/*
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const removeCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; path=/;`;
};
*/

// Store tokens in localStorage
export const storeTokens = ({ access, refresh }: Tokens) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }
};

// Get stored tokens
export const getTokens = (): Tokens | null => {
  if (typeof window === 'undefined') return null;

  const access = localStorage.getItem('accessToken');
  const refresh = localStorage.getItem('refreshToken');

  if (!access || !refresh) return null;

  return { access, refresh };
};

// Remove tokens (logout)
export const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Get current user from token
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;

  try {
    const decoded = jwtDecode<{
      user_id: number;
      email: string;
      first_name?: string;
      last_name?: string;
      is_staff?: boolean;
      is_superuser?: boolean;
      exp: number;
    }>(accessToken);
    return {
      id: decoded.user_id,
      email: decoded.email,
      first_name: decoded.first_name || '',
      last_name: decoded.last_name || '',
      is_staff: decoded.is_staff || false,
      is_superuser: decoded.is_superuser || false,
    };
  } catch (error) {
    // Log the error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Error decoding token:', error);
    }
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Refresh access token (client-side)
const refreshAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/jwt/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    return data.access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    removeTokens();
    return null;
  }
};

// Make authenticated requests (client-side)
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  if (typeof window === 'undefined') {
    throw new Error('fetchWithAuth can only be used in browser environment');
  }

  let accessToken = localStorage.getItem('accessToken');

  // If no access token, try to refresh
  if (!accessToken) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        accessToken = newAccessToken;
      } else {
        // Redirect to login if refresh fails - store current URL first
        storeRedirectUrl(window.location.pathname + window.location.search);
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
    } else {
      // No tokens available, redirect to login - store current URL first
      storeRedirectUrl(window.location.pathname + window.location.search);
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
  }

  // Add authorization header
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);

  // Make the request
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      headers.set('Authorization', `Bearer ${newAccessToken}`);
      return fetch(`${API_URL}${url}`, {
        ...options,
        headers,
        credentials: 'include',
      });
    } else {
      // If refresh fails, redirect to login - store current URL first
      removeTokens();
      storeRedirectUrl(window.location.pathname + window.location.search);
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
  }

  return response;
};

// Login function
export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/api/v1/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  const data = await response.json();
  storeTokens(data);

  // Get user info
  const userResponse = await fetchWithAuth('/api/v1/auth/users/me/');
  if (!userResponse.ok) {
    throw new Error('Failed to fetch user data');
  }

  const userData = await userResponse.json();

  // Redirect to stored URL or dashboard after successful login
  const redirectUrl = getAndClearRedirectUrl();
  if (redirectUrl) {
    window.location.href = redirectUrl;
  } else {
    window.location.href = '/dashboard';
  }

  return userData;
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    // Call the logout endpoint to blacklist the refresh token
    await fetch(`${API_URL}/api/v1/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: localStorage.getItem('refreshToken') }),
    });
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always remove tokens from localStorage
    removeTokens();
  }
};

// Register function
export const register = async (userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<User> => {
  const response = await fetch(`${API_URL}/api/v1/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...userData,
      password2: userData.password,
      user_type: 'candidate'
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      Object.values(error)
        .flat()
        .join('\n') || 'Registration failed'
    );
  }

  // Auto-login after registration
  return login(userData.email, userData.password);
};
