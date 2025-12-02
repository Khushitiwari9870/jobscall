'use client';

import Link from 'next/link';
import { FiSearch, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { FaGooglePlay, FaApple } from 'react-icons/fa';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Jobs', href: '/jobs' },
    { name: 'Companies', href: '/companies' },
    { name: 'Courses', href: '/courses' },
    { name: 'Career Guidance', href: '/career-guidance' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white text-sm py-1 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <Link href="/jobs" className="hover:underline">Jobs</Link>
            <Link href="/companies" className="hover:underline">Companies</Link>
            <Link href="/courses" className="hover:underline">Courses</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
            <div className="hidden md:flex items-center space-x-2">
              <span>Download App</span>
              <div className="flex space-x-2">
                <a href="#" className="bg-black bg-opacity-20 p-1 rounded">
                  <FaGooglePlay className="h-4 w-4" />
                </a>
                <a href="#" className="bg-black bg-opacity-20 p-1 rounded">
                  <FaApple className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            JobCall
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              <FiSearch className="h-5 w-5" />
            </button>
            <Link 
              href="/login" 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <FiUser className="h-5 w-5" />
              <span>Login / Register</span>
            </Link>
            <Link 
              href="/employer" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              For Employers
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="mt-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for jobs, companies, skills..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <Link 
                  href="/login" 
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Register
                </Link>
                <Link 
                  href="/employer" 
                  className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mt-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  For Employers
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
