// src/components/resume/ResumePDF.tsx
'use client';

import dynamic from 'next/dynamic';
import { ResumeData } from '@/types/resume';

// This will only be imported on the client side
const PDFViewer = dynamic(
  () => import('./PDFViewer'),
  { ssr: false, loading: () => <div>Loading PDF viewer...</div> }
);

interface ResumePDFProps {
  resumeData: ResumeData;
  className?: string;
}

export default function ResumePDF({ resumeData, className = '' }: ResumePDFProps) {
  if (typeof window === 'undefined') {
    return <div className={`bg-gray-100 p-4 ${className}`}>Loading PDF preview...</div>;
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <PDFViewer resumeData={resumeData} />
    </div>
  );
}