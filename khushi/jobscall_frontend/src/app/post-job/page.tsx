// This is a redirect page that will take users to the employer job posting form
// It's a simple client-side redirect to maintain backward compatibility

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostJobRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the employer job posting page
    router.replace('/employer/post-job');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center ">
    
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to job posting form...</p>
      </div>
    </div>
  );
}
