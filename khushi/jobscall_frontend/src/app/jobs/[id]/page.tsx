
import { JobDetails } from '@/components/jobs/JobDetails';
interface JobPageProps {
  params: {
    id: string;
  };
}

export default async function JobPage({ params }: JobPageProps) {
  // In a real app, you would fetch the job details here
  // const job = await getJobById(params.id);
  // if (!job) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <JobDetails jobId={params.id} />
    </div>
  );
}
