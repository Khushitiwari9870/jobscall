import Header from '@/components/job-search/Header';
import SecondaryNav from '@/components/job-search/SecondaryNav';
import JobLinkGroup from '@/components/job-search/JobLinkGroup';
import { jobData } from '@/data/jobData';

export default function JobSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SecondaryNav />
        
        <div className="space-y-8 mt-6">
          {jobData.map((section, index) => (
            <JobLinkGroup 
              key={index}
              title={section.title}
              viewAllLink={section.viewAllLink}
              items={section.items}
              columns={section.columns || 4}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
