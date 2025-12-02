'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiBriefcase, 
  FiMessageSquare, 
  FiLogOut, 
  FiGrid, 
  FiSettings, 
  FiMail, 
  FiUsers,
  FiPlus,
  FiCalendar,
  FiList
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '../ui/Logo';
import { Skeleton } from '../ui/skeleton';

type NavLinkItem = {
  name: string;
  path: string;
  icon: React.ReactElement;
  badge?: string;
  submenu?: NavLinkItem[];
};

type NavLink = NavLinkItem;

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { 
      name: 'Jobs', 
      path: '/jobs',
      icon: <FiBriefcase className="mr-1" />,
      submenu: [
        { name: 'Post a Job', path: '/employers/post-job', icon: <FiPlus className="mr-2 h-4 w-4" /> },
        { name: 'Post a Walkin', path: '/recruiter/post-walkin-job', icon: <FiCalendar className="mr-2 h-4 w-4" /> },
        { name: 'Manage Jobs', path: '/employer/jobs', icon: <FiList className="mr-2 h-4 w-4" /> }
      ]
    },
    { 
      name: 'Find Candidates', 
      path: '/find-candidates',
      icon: <FiUsers className="mr-1" />
    },
    { 
      name: 'My Jobs', 
      path: '/employer/my-jobs',
      icon: <FiBriefcase className="mr-1" />
    },
    { 
      name: 'Messages', 
      path: '/messages',
      icon: <FiMessageSquare className="mr-1" />,
      badge: '3'
    },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-blue-500/10 py-2 border-b border-blue-100' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Logo withLink={false} className="hover:opacity-80 transition-all duration-300 h-10 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <div key={link.path} className="relative">
                {link.submenu ? (
                  <div className="relative group">
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                        pathname.startsWith(link.path) 
                          ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="flex items-center">
                        {link.icon}
                        {link.name}
                      </span>
                      <svg 
                        className={`w-4 h-4 transition-all duration-300 ${openDropdown === link.name ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openDropdown === link.name && (
                      <div className="absolute left-0 mt-3 w-64 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-xl ring-1 ring-black/5 z-50 border border-blue-100 animate-in slide-in-from-top-2 fade-in-0 duration-300">
                        <div className="py-2">
                          {link.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 group"
                              onClick={() => setOpenDropdown(null)}
                              style={{ animationDelay: `${subIndex * 50}ms` }}
                            >
                              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-200 mr-3">
                                {subItem.icon}
                              </div>
                              <span className="flex-1">{subItem.name}</span>
                              {subItem.badge && (
                                <span className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                                  {subItem.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href={link.path}
                    className={`relative flex items-center px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                      pathname === link.path 
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex items-center">
                      {link.icon}
                      {link.name}
                    </span>
                    {link.badge && (
                      <span className="ml-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 text-gray-700 hover:text-blue-600 focus:outline-none rounded-lg hover:bg-blue-50 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'rotate-45' : ''}`}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                    />
                  </svg>
                </span>
              </div>
            </button>
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 group">
              <FiSearch className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 group">
              <FiBell className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce">
                3
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => toggleDropdown('user')}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 p-1 rounded-lg hover:bg-blue-50 transition-all duration-300 group"
              >
                {loading ? (
                  <Skeleton className="h-9 w-9 rounded-full" />
                ) : (
                  <div className="relative h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <FiUser className="h-5 w-5" />
                  </div>
                )}
                <span className="hidden lg:inline-block font-medium">{loading ? <Skeleton className="h-4 w-20" /> : (user?.name || 'Account')}</span>
                <svg 
                  className={`w-4 h-4 transition-all duration-300 ${openDropdown === 'user' ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openDropdown === 'user' && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-xl ring-1 ring-black/5 z-50 border border-blue-100 animate-in slide-in-from-top-2 fade-in-0 duration-300">
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <FiUser className="mr-3 h-4 w-4" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <FiSettings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      href="/recruiter-dashboard/emails"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <FiMail className="mr-3 h-4 w-4" />
                      Email
                    </Link>
                    <Link
                      href="/recruiter-dashboard"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <FiGrid className="mr-3 h-4 w-4" />
                      Recruiter Dashboard
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setOpenDropdown(null);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        <FiLogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-in slide-in-from-top-3 fade-in-0 duration-300">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-100 p-4">
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <div key={link.path} className="border-b border-blue-50 last:border-b-0 pb-2 last:pb-0">
                    <div className="flex items-center justify-between">
                      <Link
                        href={link.path}
                        className={`block px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                          pathname === link.path 
                            ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={() => {
                          setIsMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center">
                          {link.icon}
                          <span className="ml-2">{link.name}</span>
                        </div>
                      </Link>
                      {link.submenu && (
                        <button
                          onClick={() => toggleDropdown(link.name)}
                          className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        >
                          <svg 
                            className={`w-4 h-4 transition-all duration-300 ${openDropdown === link.name ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {link.submenu && openDropdown === link.name && (
                      <div className="pl-6 mt-2 space-y-1 animate-in slide-in-from-top-2 fade-in-0 duration-200">
                        {link.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                            style={{ animationDelay: `${subIndex * 30}ms` }}
                          >
                            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-r from-blue-100 to-purple-100 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-200 mr-2">
                              {subItem.icon}
                            </div>
                            <span className="flex-1">{subItem.name}</span>
                            {subItem.badge && (
                              <span className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="border-t border-blue-100 pt-4 mt-4">
                  <div className="flex items-center px-4 mb-3">
                    <div className="flex-shrink-0">
                      {loading ? (
                        <Skeleton className="h-12 w-12 rounded-full" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-lg">
                          <FiUser className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {loading ? <Skeleton className="h-4 w-24" /> : (user?.name || 'User')}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {loading ? <Skeleton className="h-3 w-32" /> : (user?.email || '')}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="mr-3 h-4 w-4" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiSettings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      href="/recruiter-dashboard/emails"
                      className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiMail className="mr-3 h-4 w-4" />
                      Email
                    </Link>
                    <Link
                      href="/recruiter-dashboard"
                      className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiGrid className="mr-3 h-4 w-4" />
                      Recruiter Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <FiLogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
