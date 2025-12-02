'use client';

import * as React from 'react';
import { Toast } from '@/components/ui/toast';
import { useToast } from './use-toast';

export function Toaster() {
  const { toasts, dismissToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-0 z-[100] flex w-full flex-col items-center space-y-2 p-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          onClose={() => dismissToast(toast.id)}
        >
          <div className="flex flex-col space-y-1">
            <div className="font-semibold">{toast.title}</div>
            <div className="text-sm opacity-90">{toast.description}</div>
            {toast.action}
          </div>
        </Toast>
      ))}
    </div>
  );
}