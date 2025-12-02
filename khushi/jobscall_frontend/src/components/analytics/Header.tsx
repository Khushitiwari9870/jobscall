'use client';

import { FiSearch, FiBell, FiUser, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const navItems = [
    { name: 'Find Candidates', hasDropdown: true },
    { name: 'Jobs', hasDropdown: true },
    { name: 'Email/SMS/IVR', hasDropdown: true },
    { name: 'Folders', hasDropdown: false },
    { name: 'Workspace', hasDropdown: true },
    { name: 'Admin', hasDropdown: true, active: true },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-purple-700">Jobscall.com</h1>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  <button
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      item.active
                        ? 'border-purple-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <FiChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
              <FiSearch className="h-6 w-6" />
            </button>
            <button className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500">
              <FiBell className="h-6 w-6" />
            </button>
            <div className="ml-4 flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <FiUser className="h-5 w-5 text-gray-600" />
              </div>
              <FiChevronDown className="ml-1 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
