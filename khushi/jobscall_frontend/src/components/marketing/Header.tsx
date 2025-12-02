'use client';

import Link from 'next/link';
import { FiDownload, FiBell, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Job Seeking Assistance', href: '/job-seeking-assistance' },
    { name: 'Courses', href: '/courses' },
    { name: 'Career Guidance', href: '/career-guidance' },
    { name: 'Blog', href: '/blog' },
  ];

  const utilityLinks = [
    { name: 'Download App', href: '/download', icon: <FiDownload className="mr-1" /> },
    { name: 'For Employers', href: '/employers' },
    { name: 'Help', href: '/help' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <div className="flex items-center space-x-6">
              {utilityLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-purple-700 flex items-center"
                >
                  {link.icon}{link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm text-gray-600 hover:text-purple-700">
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-purple-200"
              >
                Register
              </Link>
              <div className="flex items-center space-x-2 ml-2">
                <button className="p-1 text-gray-500 hover:text-purple-700">
                  <FiBell className="h-5 w-5" />
                </button>
                <button className="p-1 text-gray-500 hover:text-purple-700">
                  <FiShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <Logo withLink={false} className="h-8" />
              </Link>
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium ${
                      item.href === '/' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-700 hover:text-purple-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-700 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item.href === '/' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
