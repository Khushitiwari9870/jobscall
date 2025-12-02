"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { jobService, Job } from '@/lib/api/services/jobService';

// Format salary range
const formatSalary = (min?: number, max?: number) => {
  if (min && max) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  if (min) {
    return `From $${min.toLocaleString()}`;
  }
  if (max) {
    return `Up to $${max.toLocaleString()}`;
  }
  return 'Salary not specified';
};

// Format date to relative time
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobService.getJobs();
        setJobs(response.results);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-600 mb-2">Error loading jobs</h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-white shadow overflow-hidden rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                  {typeof job.company === 'object' && job.company.logo ? (
                    <Image 
                      src={job.company.logo} 
                      alt={job.company.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-medium">
                      {typeof job.company === 'object' ? job.company.name.charAt(0) : 'C'}
                    </span>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    {typeof job.company === 'object' ? job.company.name : 'Company'}
                  </p>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                        {job.title}
                      </Link>
                    </h3>
                  </div>
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{typeof job.company === 'number' ? 'Loading...' : job.company.name}</span>
                      <span className="mx-2">•</span>
                      <span>{job.location}</span>
                    </div>
                    {job.is_remote && (
                      <span className="flex items-center text-sm text-blue-600">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Remote
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="capitalize">{job.employment_type.replace(/_/g, ' ')}</span>
                    {(job.min_salary || job.max_salary) && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{formatSalary(job.min_salary, job.max_salary)}</span>
                      </>
                    )}
                    <span className="mx-2">•</span>
                    <span>{formatDate(job.posted_on)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
