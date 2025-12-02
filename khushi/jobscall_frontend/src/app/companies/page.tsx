'use client';

import { motion } from 'framer-motion';
import { FiSearch, FiBriefcase, FiMapPin, FiStar, FiFilter } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for companies
const companies = [
  {
    id: 1,
    name: 'TechNova Solutions',
    logo: '/images/companies/technova.png',
    industry: 'Information Technology',
    rating: 4.5,
    reviews: 128,
    jobs: 24,
    location: 'Bangalore, India',
    description: 'Leading provider of innovative software solutions with a focus on AI and machine learning technologies.'
  },
  {
    id: 2,
    name: 'GreenEarth Energy',
    logo: '/images/companies/greenearth.png',
    industry: 'Renewable Energy',
    rating: 4.2,
    reviews: 89,
    jobs: 15,
    location: 'Mumbai, India',
    description: 'Pioneers in sustainable energy solutions, committed to creating a greener future for all.'
  },
  {
    id: 3,
    name: 'Finova Capital',
    logo: '/images/companies/finova.png',
    industry: 'Financial Services',
    rating: 4.7,
    reviews: 156,
    jobs: 32,
    location: 'Delhi NCR, India',
    description: 'Innovative financial services company providing cutting-edge investment solutions.'
  },
  // Add more companies as needed
];

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Company</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Discover top companies and explore career opportunities that match your skills and aspirations.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-1 flex">
            <div className="flex-1 flex items-center px-4">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search companies by name, industry, or location..."
                className="w-full py-3 px-2 outline-none text-gray-800"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.aside 
            className="w-full md:w-1/4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button className="text-blue-600 text-sm font-medium">Reset</button>
              </div>

              {/* Industry Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FiBriefcase className="mr-2" /> Industry
                </h3>
                <div className="space-y-2">
                  {['Information Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'].map((industry) => (
                    <label key={industry} className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2 text-gray-700">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FiMapPin className="mr-2" /> Location
                </h3>
                <div className="space-y-2">
                  {['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'].map((location) => (
                    <label key={location} className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2 text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Company Size Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Company Size</h3>
                <div className="space-y-2">
                  {['1-50 employees', '51-200 employees', '201-1000 employees', '1001-5000 employees', '5000+ employees'].map((size) => (
                    <label key={size} className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2 text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                <FiFilter className="mr-2" /> Apply Filters
              </button>
            </div>
          </motion.aside>

          {/* Companies List */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Top Companies <span className="text-gray-500 text-lg">({companies.length})</span>
              </h2>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Most Relevant</option>
                  <option>Highest Rated</option>
                  <option>Most Reviews</option>
                  <option>Most Jobs</option>
                </select>
              </div>
            </div>

            <motion.div 
              className="grid gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {companies.map((company) => (
                <motion.div 
                  key={company.id}
                  variants={item}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:border-blue-100 transition-all duration-300"
                >
                  <Link href={`/companies/${company.id}`}>
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center mr-4 flex-shrink-0">
                          <div className="text-2xl font-bold text-blue-600">{company.name.charAt(0)}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                            <div className="flex items-center mt-2 sm:mt-0">
                              <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                <FiStar className="text-yellow-400 mr-1" />
                                {company.rating}
                                <span className="text-gray-500 ml-1">({company.reviews})</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 mt-1">{company.industry}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <FiMapPin className="mr-1" />
                            {company.location}
                            <span className="mx-2">•</span>
                            <span>{company.jobs} open positions</span>
                          </div>
                          <p className="text-gray-700 mt-3 line-clamp-2">{company.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Last updated: 2 days ago</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View all jobs <span className="ml-1">→</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-1">
                <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button 
                    key={page}
                    className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Can&apos;t find your company?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            If you&apos;re an employer, create your company profile and start posting jobs today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/register/employer" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Post a Job
            </Link>
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JobCall</h3>
              <p className="text-gray-400">Connecting talent with opportunity across the globe.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/companies" className="text-gray-400 hover:text-white">Top Companies</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Career Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><Link href="/post-job" className="text-gray-400 hover:text-white">Post a Job</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/solutions" className="text-gray-400 hover:text-white">Recruitment Solutions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} JobCall. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}