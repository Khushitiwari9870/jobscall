'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { PostJobForm } from './PostJobForm';

export function PostWalkInButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600"
      >
        <CalendarPlus className="h-4 w-4 mr-2" />
        Post a Walk-in
      </Button>
      
      {isOpen && (
        <PostJobForm 
          isWalkIn={true}
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
