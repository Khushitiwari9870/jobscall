'use client';


import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

// This is the component that will be imported by page.tsx

export default function VerificationContent() {
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying');
  const [countdown, setCountdown] = useState(5);
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    // Simulate verification process
    const timer = setTimeout(() => {
      // In a real app, you would verify the token from the URL with your backend
      // For now, we'll simulate a successful verification after 2 seconds
      setVerificationStatus('success');
      
      // Start countdown for redirect
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            router.push('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  const resendVerificationEmail = () => {
    // In a real app, you would call your API to resend the verification email
    console.log('Resending verification email to:', email);
    // Show success message or handle errors
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verificationStatus === 'verifying' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900">Verifying your email</h2>
              <p className="mt-2 text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">Email Verified!</h2>
              <p className="mt-2 text-gray-600">Your email has been successfully verified.</p>
              <p className="mt-2 text-sm text-gray-500">
                Redirecting to dashboard in {countdown} seconds...
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">Verification Failed</h2>
              <p className="mt-2 text-gray-600">The verification link is invalid or has expired.</p>
              <div className="mt-6">
                <button
                  onClick={resendVerificationEmail}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Resend Verification Email
                </button>
                <div className="mt-4">
                  <Link
                    href="/signup"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center"
                  >
                    <FiArrowLeft className="mr-1" />
                    Back to Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
