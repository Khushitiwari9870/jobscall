import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  withLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', withLink = true }) => {
  const content = (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Image 
          src="/logo.png" 
          alt="Jobscall Logo" 
          width={40} 
          height={40}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-900">Jobscall</span>
        <span className="text-xs text-gray-500 -mt-1">Job Portal</span>
      </div>
    </div>
  );

  if (!withLink) return content;

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      {content}
    </Link>
  );
};
