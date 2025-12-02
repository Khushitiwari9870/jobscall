import { JobList } from '@/components/jobs/JobList';
import { SearchFilters } from '@/components/jobs/SearchFilters';
import DeveloperCredit from '@/components/ui/DeveloperCredit';
import { generateSEOMetadata, generateBreadcrumbStructuredData } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "Find Jobs in India - Latest Job Vacancies & Career Opportunities",
  description: "Browse thousands of job opportunities across India. Find full-time, part-time, and contract jobs in IT, healthcare, teaching, pharma, and more industries. Apply to your dream job today!",
  keywords: [
    "jobs in India",
    "job vacancies",
    "career opportunities",
    "IT jobs",
    "healthcare jobs",
    "teaching jobs",
    "pharma jobs",
    "government jobs",
    "private jobs",
    "fresher jobs",
    "experienced jobs",
    "walk-in jobs",
    "job search",
    "employment",
    "hiring",
  ],
  canonical: "/jobs",
  ogType: "website",
});

export default function JobsPage() {
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "Home", url: "https://jobscall.com" },
    { name: "Jobs", url: "https://jobscall.com/jobs" },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
        <p className="text-gray-600">Browse through thousands of full-time and part-time jobs near you</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <SearchFilters />
        </div>
        <div className="w-full md:w-3/4">
          <JobList />
        </div>
      </div>

      {/* Developer Credit */}
      <DeveloperCredit />
    </div>
  );
}
