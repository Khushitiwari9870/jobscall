
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import DeveloperCredit from '@/components/ui/DeveloperCredit';
import { generateJobPostingStructuredData } from '@/lib/seo';

// Mock data for featured jobs with base64 placeholders
const featuredJobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzI1NjNjZCIgZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAxOGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiLz48L3N2Zz4=',
    isNew: true
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateX',
    location: 'Remote',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2UxMWQyZSIgZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAxOGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiLz48L3N2Zz4=',
    isNew: false
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    company: 'DesignHub',
    location: 'New York, NY',
    type: 'Contract',
    salary: '$50 - $70/hr',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzhiMTBlYiIgZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAxOGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiLz48L3N2Zz4=',
    isNew: true
  }
];

// Categories data
const categories = [
  { name: 'Technology', count: 124, icon: '💻' },
  { name: 'Marketing', count: 89, icon: '📈' },
  { name: 'Design', count: 76, icon: '🎨' },
  { name: 'Finance', count: 92, icon: '💰' },
  { name: 'Healthcare', count: 110, icon: '🏥' },
  { name: 'Education', count: 67, icon: '📚' }
];

export default function Home() {
  // Generate structured data for featured jobs
  const featuredJobsStructuredData = featuredJobs.map(job => 
    generateJobPostingStructuredData({
      title: job.title,
      description: `Join ${job.company} as a ${job.title}. ${job.type} position in ${job.location}.`,
      company: job.company,
      location: job.location,
      salary: job.salary,
      employmentType: job.type,
      datePosted: new Date().toISOString(),
      validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      url: `https://jobscall.com/jobs/${job.id}`,
    })
  );
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(featuredJobs);
  const [isSearching, setIsSearching] = useState(false);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const filtered = featuredJobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.company.toLowerCase().includes(searchQuery.toLowerCase()); 
        const matchesLocation = location === '' || 
                             job.location.toLowerCase().includes(location.toLowerCase());
        return matchesSearch && matchesLocation;
      });
      
      setFilteredJobs(filtered);
      setIsSearching(false);
      
      // Scroll to results
      const jobsSection = document.getElementById('featured-jobs');
      if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setLocation('');
    setFilteredJobs(featuredJobs);
  };

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
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Structured Data for Featured Jobs */}
      {featuredJobsStructuredData.map((structuredData, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      ))}
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Welcome to <span className="text-yellow-300">Jobscall</span>
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-semibold mb-4"
            >
              Find Your Next <span className="text-yellow-300">Opportunity</span>
            </motion.h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Search thousands of jobs, internships, and career opportunities. Apply easily and get hired faster.
            </p>
            
            {/* Search Form */}
            <motion.form 
              onSubmit={handleSearch}
              className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-2">
                  <div className="flex items-center h-full px-4 border-r border-gray-200">
                    <FiSearch className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      className="w-full py-4 focus:outline-none text-gray-800 placeholder-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1 p-2">
                  <div className="flex items-center h-full px-4">
                    <FiMapPin className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full py-4 focus:outline-none text-gray-800 placeholder-gray-400"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-6 transition duration-300 whitespace-nowrap disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Search Jobs'}
                </button>
              </div>
            </motion.form>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="text-sm font-medium text-blue-100">Popular Searches:</span>
              {['Software Engineer', 'Marketing Manager', 'Data Analyst', 'HR Executive'].map((job) => (
                <motion.button
                  key={job}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition cursor-pointer"
                  onClick={() => {
                    setSearchQuery(job);
                    setLocation('');
                  }}
                >
                  {job}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div id="featured-jobs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Featured <span className="text-blue-600">Jobs</span>
          </motion.h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Search Results */}
        <div className="mb-8">
          {(searchQuery || location) && (
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">
                  Showing results for: 
                  {searchQuery && <span className="font-medium ml-2">&ldquo;{searchQuery}&rdquo;</span>}
                  {location && <span className="ml-2">in <span className="font-medium">&ldquo;{location}&rdquo;</span></span>}
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you&apos;re looking for.</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                          <Image 
                            src={job.logo} 
                            alt={`${job.company} logo`} 
                            width={48} 
                            height={48}
                            className="object-contain"
                            unoptimized={job.logo.startsWith('data:image')}
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                      </div>
                      {job.isNew && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <FiMapPin className="mr-2" size={16} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiBriefcase className="mr-2" size={16} />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiDollarSign className="mr-2" size={16} />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    <button 
                      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mt-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            Browse by <span className="text-blue-600">Category</span>
          </motion.h2>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.name}
                variants={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSearchQuery(category.name);
                  setLocation('');
                }}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} jobs</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to find your dream job?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who found their dream jobs with us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition duration-300"
              onClick={() => router.push('/post-job')}
            >
              Post a Job
            </button>
            <button 
              className="bg-transparent border-2 border-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full transition duration-300"
              onClick={() => router.push('/jobs')}
            >
              Browse All Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <a href="/about" className="text-gray-600 hover:text-gray-900">About Us</a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
            <a href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
          </div>
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Jobscall. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Developer Credit */}
      <DeveloperCredit />
    </>
  );
}