'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Check if user is authenticated
    const isAuthenticated = !!user;
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      router.push(redirectTo);
      return;
    }

    // If role is required, check if user has it
    if (requiredRole) {
      // Assuming user has a 'role' property. Adjust according to your user object structure
      const hasRequiredRole = user.role === requiredRole;
      if (!hasRequiredRole) {
        router.push('/');
        return;
      }
    }

    // If we get here, user is authorized
    setIsAuthorized(true);
  }, [user, loading, requiredRole, router, redirectTo]);

  // Show loading state while checking auth status
  if (loading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

