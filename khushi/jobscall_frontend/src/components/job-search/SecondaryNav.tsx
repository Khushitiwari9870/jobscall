'use client';

import Link from 'next/link';

export default function SecondaryNav() {
  const navItems = [
    { name: 'Companies', href: '/companies', active: true },
    { name: 'Skill', href: '/skill' },
    { name: 'Designation', href: '/designation' },
    { name: 'Cities', href: '/cities' },
    { name: 'Category', href: '/category' },
    { name: 'Other Jobs', href: '/other-jobs' },
  ];

  return (
    <div className="bg-white shadow-sm rounded-md overflow-hidden">
      <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="flex space-x-1 px-4 py-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                item.active
                  ? 'text-purple-700 border-b-2 border-purple-700'
                  : 'text-gray-700 hover:text-purple-700 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
