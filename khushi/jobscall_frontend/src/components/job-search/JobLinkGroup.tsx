'use client';

import Link from 'next/link';

interface JobLinkGroupProps {
  title: string;
  viewAllLink: string;
  items: (string | { text: string; subtext: string })[];
  columns: number;
  hasSubtext?: boolean;
}

export default function JobLinkGroup({
  title,
  viewAllLink,
  items,
  columns = 4,
  hasSubtext = false,
}: JobLinkGroupProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }[columns] || 'grid-cols-2 md:grid-cols-4';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <Link 
            href={viewAllLink}
            className="text-sm font-medium text-purple-700 hover:underline"
          >
            View All
          </Link>
        </div>
      </div>
      
      <div className={`grid ${gridCols} gap-4 p-6`}>
        {items.map((item, index) => {
          const text = typeof item === 'string' ? item : item.text;
          const subtext = typeof item === 'object' ? item.subtext : null;
          
          return (
            <div key={index} className="group">
              <Link 
                href={`/jobs/${text.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-purple-700 hover:underline text-sm font-medium"
              >
                {text}
              </Link>
              {hasSubtext && subtext && (
                <p className="text-xs text-gray-500 mt-1">{subtext}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
