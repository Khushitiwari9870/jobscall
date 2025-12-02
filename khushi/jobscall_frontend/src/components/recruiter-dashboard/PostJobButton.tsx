'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PostJobForm } from './PostJobForm';

export function PostJobButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Post a Job
      </Button>
      
      {isOpen && (
        <PostJobForm 
          isWalkIn={false}
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
