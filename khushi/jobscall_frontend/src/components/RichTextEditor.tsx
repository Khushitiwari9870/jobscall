'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Import the CSS for the editor
import 'react-quill/dist/quill.snow.css';

// Create a custom wrapper component that handles the dynamic import
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return RQ;
  },
  { 
    ssr: false,
    loading: () => (
      <div className="h-48 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    )
  }
);

// Define the modules for the editor
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean']
  ]
};

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange,
  className = ''
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isQuillSupported, setIsQuillSupported] = useState<boolean | null>(null);
  const quillRef = useRef<HTMLTextAreaElement | null>(null);

  // Only render the editor on the client side
  useEffect(() => {
    let active = true;
    setIsMounted(true);

    (async () => {
      try {
        await import('react-dom');
        if (!active) {
          return;
        }
        setIsQuillSupported(true);
      } catch {
        if (active) {
          setIsQuillSupported(false);
        }
      }
    })();

    return () => {
      active = false;
      setIsMounted(false);
    };
  }, []);

  // Handle the change event
  const handleChange = useCallback((content: string) => {
    onChange(content);
  }, [onChange]);

  if (!isMounted || isQuillSupported === null) {
    return (
      <div className={`h-48 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-md border border-gray-300 ${className}`}>
      {/* <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        className="h-48 [&_.ql-toolbar]:border-0 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[150px]"
        forwardedRef={quillRef}
      /> */}
      {isQuillSupported ? (
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={handleChange}
          modules={modules}
          className="h-48 [&_.ql-toolbar]:border-0 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[150px]"
        />
      ) : (
        <textarea
          ref={quillRef}
          value={value || ''}
          onChange={(event) => handleChange(event.target.value)}
          className="h-48 w-full border-0 focus:ring-0 focus:outline-none p-4 text-sm text-gray-700"
        />
      )}
    </div>
  );
}
