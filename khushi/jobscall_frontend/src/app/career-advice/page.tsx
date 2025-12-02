'use client';

import { useState } from 'react';
import { FiSearch, FiBookOpen, FiTrendingUp, FiBriefcase, FiUserCheck, FiFileText } from 'react-icons/fi';
import PageLayout from '@/components/layout/PageLayout';

const articles = [
  {
    id: 1,
    title: '10 Tips for Acing Your Next Job Interview',
    excerpt: 'Learn proven strategies to impress hiring managers and land your dream job.',
    category: 'Interview Tips',
    readTime: '5 min read',
    date: '2023-10-05',
    icon: <FiUserCheck className="h-6 w-6 text-blue-600" />
  },
  {
    id: 2,
    title: 'How to Write a Standout Resume in 2023',
    excerpt: 'Discover the latest resume trends and best practices to make your application shine.',
    category: 'Resume Writing',
    readTime: '7 min read',
    date: '2023-10-03',
    icon: <FiFileText className="h-6 w-6 text-green-600" />
  },
  {
    id: 3,
    title: 'Navigating Career Transitions Successfully',
    excerpt: 'Thinking about changing careers? Here\'s how to make a smooth transition.',
    category: 'Career Growth',
    readTime: '8 min read',
    date: '2023-09-28',
    icon: <FiTrendingUp className="h-6 w-6 text-purple-600" />
  },
  {
    id: 4,
    title: 'Remote Work: Best Practices for Success',
    excerpt: 'Master the art of working remotely and boost your productivity from home.',
    category: 'Workplace',
    readTime: '6 min read',
    date: '2023-09-25',
    icon: <FiBriefcase className="h-6 w-6 text-yellow-600" />
  },
  {
    id: 5,
    title: 'Salary Negotiation Strategies That Work',
    excerpt: 'Get paid what you\'re worth with these expert negotiation techniques.',
    category: 'Salary',
    readTime: '9 min read',
    date: '2023-09-20',
    icon: <FiTrendingUp className="h-6 w-6 text-red-600" />
  },
  {
    id: 6,
    title: 'Building a Strong Personal Brand Online',
    excerpt: 'Leverage social media and online platforms to enhance your professional image.',
    category: 'Personal Branding',
    readTime: '7 min read',
    date: '2023-09-15',
    icon: <FiUserCheck className="h-6 w-6 text-indigo-600" />
  }
];

const categories = [
  { name: 'All', count: articles.length },
  { name: 'Interview Tips', count: 5 },
  { name: 'Resume Writing', count: 8 },
  { name: 'Career Growth', count: 12 },
  { name: 'Workplace', count: 7 },
  { name: 'Salary', count: 6 },
  { name: 'Personal Branding', count: 4 },
];

export default function CareerAdvice() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout
      title="Career Advice"
      description="Expert career advice, interview tips, and professional development resources"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Career Advice & Resources</h1>
            <p className="text-xl text-blue-100">Expert insights to help you navigate your career journey</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search articles, tips, and resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      selectedCategory === category.name
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Resume', 'Cover Letter', 'Interview', 'Negotiation', 'Remote Work', 'Career Change', 'Networking', 'LinkedIn'].map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                          {article.icon}
                        </div>
                        <div className="ml-3">
                          <span className="text-sm font-medium text-blue-600">{article.category}</span>
                          <div className="flex items-center text-xs text-gray-500 mt-0.5">
                            <span>{article.date}</span>
                            <span className="mx-2">•</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Read more →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you&apos;re looking for.</p>
                </div>
              )}
            </div>

            {filteredArticles.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Career Tips Straight to Your Inbox</h2>
            <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest career advice and job search tips.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
