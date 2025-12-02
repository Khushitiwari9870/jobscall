// src/app/find-candidates/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign, FiFilter, FiUser, FiMail, FiLinkedin, FiGithub } from 'react-icons/fi';

interface Candidate {
  id: number;
  name: string;
  title: string;
  location: string;
  experience: number;
  skills: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  notice_period: number;
  education: string;
  email: string;
  phone: string;
  linkedin_url?: string;
  github_url?: string;
  resume_url: string;
  is_willing_to_relocate: boolean;
}

const locations = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida'
];

const skills = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript',
  'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Science',
  'DevOps', 'UI/UX', 'Product Management'
];

export default function FindCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    experienceMin: 0,
    experienceMax: 30,
    salaryMin: 0,
    salaryMax: 1000,
    location: '',
    noticePeriod: 0,
    education: '',
    employmentType: 'any',
    searchQuery: '',
    excludeKeywords: '',
    willingToRelocate: false,
  });

  // Fetch candidates based on filters
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.skills.length > 0) {
        params.append('skills', filters.skills.join(','));
      }
      if (filters.experienceMin > 0) {
        params.append('experience_min', filters.experienceMin.toString());
      }
      if (filters.experienceMax < 30) {
        params.append('experience_max', filters.experienceMax.toString());
      }
      if (filters.salaryMin > 0) {
        params.append('salary_min', filters.salaryMin.toString());
      }
      if (filters.salaryMax < 1000) {
        params.append('salary_max', filters.salaryMax.toString());
      }
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.noticePeriod > 0) {
        params.append('notice_period', filters.noticePeriod.toString());
      }
      if (filters.searchQuery) {
        params.append('search', filters.searchQuery);
      }
      if (filters.excludeKeywords) {
        params.append('exclude', filters.excludeKeywords);
      }
      if (filters.willingToRelocate) {
        params.append('willing_to_relocate', 'true');
      }

      const response = await fetch(`/api/v1/candidates/?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      setCandidates(data.results || []);
    } catch (err) {
      setError('Error loading candidates. Please try again later.');
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      skills: [],
      experienceMin: 0,
      experienceMax: 30,
      salaryMin: 0,
      salaryMax: 1000,
      location: '',
      noticePeriod: 0,
      education: '',
      employmentType: 'any',
      searchQuery: '',
      excludeKeywords: '',
      willingToRelocate: false,
    });
  };

  // Initial data load
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Find Candidates</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiFilter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-80 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
                
                {/* Search Input */}
                <div className="mb-6">
                  <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="searchQuery"
                      id="searchQuery"
                      value={filters.searchQuery}
                      onChange={handleFilterChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search candidates..."
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          filters.skills.includes(skill)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (years)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      name="experienceMin"
                      min="0"
                      max={filters.experienceMax}
                      value={filters.experienceMin}
                      onChange={handleFilterChange}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="Min"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      name="experienceMax"
                      min={filters.experienceMin}
                      max="30"
                      value={filters.experienceMax}
                      onChange={handleFilterChange}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Salary */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary (LPA)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      name="salaryMin"
                      min="0"
                      max={filters.salaryMax}
                      value={filters.salaryMin}
                      onChange={handleFilterChange}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="Min"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      name="salaryMax"
                      min={filters.salaryMin}
                      max="1000"
                      value={filters.salaryMax}
                      onChange={handleFilterChange}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Notice Period */}
                <div className="mb-6">
                  <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Period
                  </label>
                  <select
                    id="noticePeriod"
                    name="noticePeriod"
                    value={filters.noticePeriod}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="0">Any</option>
                    <option value="0">Immediate</option>
                    <option value="15">15 days</option>
                    <option value="30">30 days</option>
                    <option value="45">45 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90+ days</option>
                  </select>
                </div>

                {/* Willing to Relocate */}
                <div className="flex items-center">
                  <input
                    id="willingToRelocate"
                    name="willingToRelocate"
                    type="checkbox"
                    checked={filters.willingToRelocate}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="willingToRelocate" className="ml-2 block text-sm text-gray-700">
                    Willing to relocate
                  </label>
                </div>
              </div>

              {/* AI Search */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Powered Search</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Let our AI find the best candidates based on your requirements.
                </p>
                <button
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Find with AI
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Results */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {loading ? 'Searching...' : `${candidates.length} candidates found`}
                  </h3>
                  <div className="flex space-x-2">
                    <select
                      id="sort"
                      className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option>Most Relevant</option>
                      <option>Most Recent</option>
                      <option>Experience (High to Low)</option>
                      <option>Experience (Low to High)</option>
                    </select>
                  </div>
                </div>
              </div>

              {error ? (
                <div className="p-6 text-red-600">{error}</div>
              ) : loading ? (
                <div className="p-6 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : candidates.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No candidates found matching your criteria. Try adjusting your filters.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <li key={candidate.id} className="p-6 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                              <FiUser className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900 truncate">
                                {candidate.name}
                                <span className="ml-2 text-sm text-gray-500">{candidate.title}</span>
                              </h4>
                              <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                                <div className="flex items-center mr-4">
                                  <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  {candidate.location}
                                </div>
                                <div className="flex items-center mr-4">
                                  <FiBriefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  {candidate.experience} years
                                </div>
                                <div className="flex items-center">
                                  <FiDollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  {candidate.salary.min} - {candidate.salary.max} LPA
                                </div>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {candidate.skills.slice(0, 4).map((skill) => (
                                  <span
                                    key={skill}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {candidate.skills.length > 4 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    +{candidate.skills.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-5 flex-shrink-0 flex flex-col space-y-2">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                          >
                            <FiMail className="-ml-1 mr-2 h-4 w-4" />
                            Contact
                          </button>
                          <a
                            href={candidate.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View Resume
                          </a>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-4">
                        {candidate.linkedin_url && (
                          <a
                            href={candidate.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">LinkedIn</span>
                            <FiLinkedin className="h-5 w-5" />
                          </a>
                        )}
                        {candidate.github_url && (
                          <a
                            href={candidate.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">GitHub</span>
                            <FiGithub className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pagination */}
            {candidates.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{' '}
                      <span className="font-medium">10</span> of{' '}
                      <span className="font-medium">{candidates.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <a
                        href="#"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
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
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <h2 className="text-2xl font-bold text-white">JobCall</h2>
              <p className="text-gray-300 text-base">
                Connecting talented professionals with great companies.
              </p>
              <div className="flex space-x-6">
                {['Twitter', 'Facebook', 'LinkedIn', 'Instagram'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">{social}</span>
                    <span className="h-6 w-6">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    For Job Seekers
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {['Browse Jobs', 'Create Resume', 'Job Alerts', 'Career Advice'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-300 hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    For Employers
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {['Post a Job', 'Browse Candidates', 'Pricing', 'Recruitment Solutions'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-300 hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Company
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {['About Us', 'Careers', 'Blog', 'Press'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-300 hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-300 hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; {new Date().getFullYear()} JobCall. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}