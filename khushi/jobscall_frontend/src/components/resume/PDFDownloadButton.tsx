// src/components/resume/PDFDownloadButton.tsx
'use client';

import { PDFDownloadLink, Document, Page, StyleSheet } from '@react-pdf/renderer';
import { FiDownload } from 'react-icons/fi';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ResumeData } from '@/types/resume';

// Register font if needed
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  }
});

interface PDFDownloadButtonProps {
  resumeData: ResumeData;
  fileName?: string;
  className?: string;
  children?: ReactNode;
}

export default function PDFDownloadButton({ 
  resumeData, 
  fileName = 'resume.pdf', 
  className = '',
  children 
}: PDFDownloadButtonProps) {
  // Import the PDFViewer component dynamically to avoid SSR issues
  const PDFViewer = dynamic(
    () => import('./PDFViewer'),
    { ssr: false }
  );

  return (
    <PDFDownloadLink
      document={
        <Document>
          <Page size="A4" style={styles.page}>
            <PDFViewer resumeData={resumeData} />
          </Page>
        </Document>
      }
      fileName={fileName}
    >
      {({ loading }) => (
        <button
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 ${className}`}
          disabled={loading}
        >
          <FiDownload className="w-5 h-5" />
          {loading ? 'Generating PDF...' : children || 'Download PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}