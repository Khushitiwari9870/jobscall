'use client';

import React from 'react';

const DeveloperCredit = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <span className="flex items-center space-x-2">
          <span className="animate-pulse">✨</span>
          <span>Developed by</span>
          <a
            href="https://www.linkedin.com/in/khushi-tiwari-323a43289/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 cursor-pointer"
          >
            Khushi Tiwari
          </a>
          <span className="animate-bounce">🚀</span>
        </span>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Full Stack Developer
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCredit;
