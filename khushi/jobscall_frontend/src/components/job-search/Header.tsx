'use client';

import Link from 'next/link';
import { FiSearch, FiUser, FiShoppingCart, FiDownload } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-3 border-b">
          <div className="flex items-center space-x-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-purple-700">JobSearch</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Job title, skills"
                className="w-full py-2 pl-4 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FiSearch className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/download-app" className="flex items-center text-sm text-gray-700 hover:text-purple-700">
              <FiDownload className="h-5 w-5 mr-1" />
              <span>Download App</span>
            </Link>
            <Link href="/employers" className="text-sm text-gray-700 hover:text-purple-700">
              For Employers
            </Link>
            <Link href="/help" className="text-sm text-gray-700 hover:text-purple-700">
              Help
            </Link>
            <Link href="/login" className="text-sm text-gray-700 hover:text-purple-700">
              <FiUser className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-purple-700">
              <FiShoppingCart className="h-5 w-5" />
            </Link>
          </div>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex space-x-8 py-3">
          <NavLink href="/" label="Home" />
          <NavLink href="/jobs" label="Jobs" active />
          <NavLink href="/job-seeking-assistance" label="Job Seeking Assistance" />
          <NavLink href="/courses" label="Courses" />
          <NavLink href="/career-guidance" label="Career Guidance" />
          <NavLink href="/blog" label="Blog" />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="text-sm font-medium text-gray-700">
        {label}
      </div>
    );
  }

  return (
    <Link 
      href={href}
      className={`text-sm font-medium ${active ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-700 hover:text-purple-700'}`}
    >
      {label}
    </Link>
  );
}
