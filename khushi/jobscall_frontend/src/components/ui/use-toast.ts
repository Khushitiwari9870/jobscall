// This is a simplified version. You might need to adjust it based on your needs.
import { useState, useCallback } from 'react';

type Toast = {
  id: string;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Memoize dismissToast to prevent it from being recreated on every render
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((props: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
    action?: React.ReactNode;
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...props, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      dismissToast(id);
    }, 5000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [dismissToast]);

  return { toasts, showToast, dismissToast };
}