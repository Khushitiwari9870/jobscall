export interface APIError extends Error {
  message: string;
  status: number;
  data?: unknown;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  [key: string]: string[] | string | ValidationError | undefined;
}

export function isAPIError(error: unknown): error is APIError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
}

export function isValidationError(error: unknown): error is { errors: ValidationError } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    typeof error.errors === 'object' &&
    error.errors !== null
  );
}

export function getErrorMessage(error: unknown): string {
  if (isAPIError(error)) {
    return error.message;
  }
  if (isValidationError(error)) {
    return 'Validation error';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}