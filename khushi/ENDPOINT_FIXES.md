# API Endpoint Fixes - Summary

## Problem
The frontend was using incorrect API endpoints that didn't match the Django backend, resulting in 404 errors for login and registration.

## Django Backend Endpoints (Correct)
- `login/` - Login endpoint
- `register/` - Registration endpoint  
- `logout/` - Logout endpoint
- `api/v1/auth/jwt/refresh/` - Token refresh
- `api/v1/auth/jwt/verify/` - Token verification
- `api/v1/users/me/` - Get current user profile

## Files Updated

### 1. `src/lib/api/services/authService.ts`
**Changes:**
- ✓ Login: `api/auth/login/` → `login/`
- ✓ Register: `api/auth/register/` → `register/`
- ✓ Refresh Token: `api/auth/token/refresh/` → `api/v1/auth/jwt/refresh/`

### 2. `src/lib/api/apiClient.ts`
**Changes:**
- ✓ Token Refresh in interceptor: `/api/auth/token/refresh/` → `/api/v1/auth/jwt/refresh/`

### 3. `src/app/signup/page.tsx`
**Changes:**
- ✓ Removed hardcoded fetch to `http://localhost:8000/api/auth/register/`
- ✓ Now uses `useAuth()` hook and `register()` method from AuthContext
- ✓ Auto-login after successful registration

### 4. `src/lib/api/auth.ts`
**Changes:**
- ✓ Login: `/auth/jwt/create/` → `/login/`
- ✓ Register: `/auth/users/` → `/register/`
- ✓ Get User: `/auth/users/me/` → `/users/me/`
- ✓ Logout: `/auth/jwt/logout/` → `/logout/`
- ✓ Password Reset: `/auth/users/reset_password/` → `/password-reset/`
- ✓ Password Reset Confirm: `/auth/users/reset_password_confirm/` → `/password-reset-confirm/`

### 5. `src/lib/auth.ts`
**Changes:**
- ✓ Login: `/auth/jwt/create/` → `/../login/`
- ✓ Register: `/auth/users/` → `/../register/`
- ✓ Get User: `/auth/users/me/` → `/users/me/`
- ✓ Logout: `/auth/jwt/logout/` → `/../logout/`

## Expected Behavior After Fix
1. **Login**: POST to `http://localhost:8000/login/` ✓
2. **Register**: POST to `http://localhost:8000/register/` ✓
3. **Token Refresh**: POST to `http://localhost:8000/api/v1/auth/jwt/refresh/` ✓
4. **Get Profile**: GET to `http://localhost:8000/api/v1/users/me/` ✓

## Testing Instructions
1. Clear browser localStorage and cookies
2. Try registering a new user at `/signup`
3. Verify automatic login after registration
4. Try logging in with credentials at `/login`
5. Verify token refresh works on protected routes

## Notes
- All endpoints now match the Django backend URL patterns
- The signup page now properly uses the AuthContext instead of direct fetch calls
- Token refresh mechanism updated in both apiClient and legacy auth files
