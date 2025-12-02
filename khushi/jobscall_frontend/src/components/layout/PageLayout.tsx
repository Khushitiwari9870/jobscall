import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';

type PageLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export default function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title} | JobCall</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JobSeekers</h3>
              <ul className="space-y-2">
                <li><Link href="/salary-calculator" className="text-gray-600 hover:text-blue-600">Salary Calculator</Link></li>
                <li><Link href="/career-advice" className="text-gray-600 hover:text-blue-600">Career Advice</Link></li>
                <li><Link href="/resume-builder" className="text-gray-600 hover:text-blue-600">Resume Builder</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Employers</h3>
              <ul className="space-y-2">
                <li><Link href="/employers/post-job" className="text-gray-600 hover:text-blue-600">Post a Job</Link></li>
                <li><Link href="/employers/browse-resumes" className="text-gray-600 hover:text-blue-600">Browse Resumes</Link></li>
                <li><Link href="/employers/solutions" className="text-gray-600 hover:text-blue-600">Solutions</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">About JobCall</h3>
              <p className="text-gray-600 mb-4">Connecting top talent with great companies.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">&copy; {new Date().getFullYear()} JobCall. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
