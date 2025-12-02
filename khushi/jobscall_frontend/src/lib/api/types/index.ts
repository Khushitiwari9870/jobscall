// Re-export all types from individual service files
export * from '../services/authService';
export * from '../services/jobService';
export * from '../services/interviewsService';
export * from '../services/activityService';

// Common types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// API Response type for better type safety
export type ApiResponse<T> = {
  data?: T;
  error?: ErrorResponse;
  status: number;
  statusText: string;
};

// Common query parameters for paginated lists
export interface ListQueryParams {
  // Pagination
  page?: number;
  page_size?: number;
  
  // Search and filtering
  search?: string;
  ordering?: string;
  
  // Allow additional string-indexed properties for filters
  [key: string]: string | number | boolean | undefined;
}

// File upload type
export interface FileUpload {
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified?: number;
}

// Generic request config
export interface ApiRequestConfig extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  data?: unknown;
  headers?: Record<string, string>;
}

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API client configuration
export interface ApiClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

// Generic API response
export interface ApiResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    status?: number;
    details?: unknown;
  };
  status?: number;
}

// Generic API error
export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    
    // Set the prototype explicitly for TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Type guard for ErrorResponse
export function isErrorResponse(error: unknown): error is ErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ErrorResponse).message === 'string'
  );
}

// Type guard for ApiError
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
