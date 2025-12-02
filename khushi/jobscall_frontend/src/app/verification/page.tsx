'use client';

import { Suspense } from 'react';
import VerificationContent from './VerificationContent';

export default function VerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}
