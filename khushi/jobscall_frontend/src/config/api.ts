// API configuration
export const API_CONFIG = {
  // Use NEXT_PUBLIC_API_URL when provided (build-time). If not provided then
  // in development, point to Django backend on port 8000
  // In production, default to the current origin plus '/api' so the frontend
  // talks to the same host that serves the site (recommended when using nginx proxy).
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1/`
      : 'http://localhost:8000/api/v1/'),
  // Add other API-related configurations here
} as const;
