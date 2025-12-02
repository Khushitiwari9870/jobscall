'use client';

import JobAlertForm from '@/components/job-alerts/JobAlertForm';
import FAQSection from '@/components/job-alerts/FAQSection';
import { FiDownload } from 'react-icons/fi';

export default function JobAlertsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-purple-700">JobCall</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-purple-700 flex items-center">
              <FiDownload className="mr-1" /> Download App
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-700">For Employers</a>
            <a href="#" className="text-gray-600 hover:text-purple-700">Help</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Alert Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create a Free Job Alert</h2>
              <p className="text-gray-600 mb-6">You can create up to 5 alerts.</p>
              
              <JobAlertForm />
              
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Latest Free Job Alerts 2025: 300,000+ Jobs Now!</h3>
                <p className="text-gray-600 mb-6">
                  Stay ahead in your job search with our free job alerts. Get notified about the latest job opportunities matching your profile and preferences.
                </p>
                
                <div className="space-y-8">
                  <section>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">What is a Free Job Alert?</h4>
                    <p className="text-gray-600">
                      A free job alert is an automated notification system that sends you email updates about new job postings that match your specified criteria, helping you stay updated with the latest opportunities.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Benefits of Free Job Alerts</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li>Get instant notifications about relevant job openings</li>
                      <li>Save time in your job search</li>
                      <li>Never miss out on new opportunities</li>
                      <li>Customize alerts based on your preferences</li>
                      <li>100% free service with no hidden charges</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">How does it work?</h4>
                    <ol className="list-decimal pl-5 space-y-3 text-gray-600">
                      <li>Fill in your job preferences (keywords, location, experience, etc.)</li>
                      <li>Enter your email address</li>
                      <li>Click &apos;Save&apos; to create your alert</li>
                      <li>Receive email notifications for matching jobs</li>
                      <li>Apply to jobs directly from your email</li>
                    </ol>
                  </section>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - FAQ */}
          <div className="lg:col-span-1">
            <FAQSection />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Job Seekers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Search Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Create Free Account</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Job Alerts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Resume Writing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Employers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Post a Job</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Resumes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Trending Jobs</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">IT Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Banking Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Sales Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Marketing Jobs</a></li>
              </ul>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Contact Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
              <div className="text-gray-400">
                <p className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@jobcall.com
                </p>
                <p className="flex items-center mt-2">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms & Conditions</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Feedback</a>
              </div>
              <p className="mt-4 md:mt-0 text-gray-400 text-sm">
                Copyright © 2025 JobCall. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
