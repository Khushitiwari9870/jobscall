'use client';

import { useState, useEffect } from 'react';
import { getMyInterviews } from '@/lib/api/services/interviewsService';
import Link from 'next/link';
import { FiCalendar, FiClock, FiVideo, FiMapPin } from 'react-icons/fi';

// Import the correct type from the service
interface InterviewWithJob {
  id: string;
  candidate_name: string;
  interview_type: string;
  scheduled_date: string;
  status: string;
  notes?: string;
  interviewer?: string;
  location?: string;
  meeting_link?: string;
  jobTitle: string;
  company: string;
}

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState<InterviewWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        const data = await getMyInterviews();
        setInterviews(data);
      } catch (error) {
        console.error('Failed to fetch interviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">My Interviews</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading interviews...</p>
            </div>
          ) : interviews.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {interviews.map((interview) => (
                  <li key={interview.id}>
                    <Link href={`/interviews/${interview.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-blue-600 truncate">{interview.candidate_name}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {interview.interview_type}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {new Date(interview.scheduled_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <FiClock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {new Date(interview.scheduled_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {interview.meeting_link ? <FiVideo className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" /> : <FiMapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />}
                            {interview.location || interview.meeting_link || 'TBD'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming interviews</h3>
              <p className="mt-1 text-sm text-gray-500">Check back here for updates on your interview schedule.</p>
              <div className="mt-6">
                <Link href="/jobs" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Find a Job
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewsPage;
