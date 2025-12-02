import React from 'react';

interface JobDetailsProps {
  jobId: string;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ jobId }) => {
  // In a real implementation, you would fetch job details using the jobId
  // const { data: job, isLoading } = useJobDetails(jobId);

  // if (isLoading) return <div>Loading job details...</div>;
  // if (!job) return <div>Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4">Job Details</h1>
      <p className="text-gray-600 mb-4">Job ID: {jobId}</p>
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold">Senior Frontend Developer</h2>
          <p className="text-gray-600">Acme Inc. • San Francisco, CA • Full-time</p>
        </div>
        
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold">Job Description</h3>
          <p>
            We are looking for a skilled Frontend Developer to join our team. 
            You will be responsible for building user interfaces using React and Next.js.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Requirements</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>3+ years of experience with React</li>
            <li>Proficiency in TypeScript</li>
            <li>Experience with Next.js and modern frontend tooling</li>
            <li>Strong problem-solving skills</li>
          </ul>
        </div>
        
        <div className="pt-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};
