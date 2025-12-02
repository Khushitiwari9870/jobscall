import apiClient from '../apiClient';
import { apiEndpoints } from '../endpoints';

interface Application {
  job: {
    title: string;
    company: {
      name: string;
    };
  };
  interviews?: Interview[];
}

interface Interview {
  id: string;
  candidate_name: string;
  interview_type: string;
  scheduled_date: string;
  status: string;
  notes?: string;
  interviewer?: string;
  location?: string;
  meeting_link?: string;
}

interface InterviewWithJob extends Interview {
  jobTitle: string;
  company: string;
}

export const getMyInterviews = async (): Promise<InterviewWithJob[]> => {
  const response = await apiClient.get(apiEndpoints.adminActivities);

  const interviews = response.data.results.reduce((acc: InterviewWithJob[], application: Application) => {
    if (application.interviews && application.interviews.length > 0) {
      const applicationInterviews = application.interviews.map((interview: Interview) => ({
        ...interview,
        jobTitle: application.job.title,
        company: application.job.company.name,
      }));
      return [...acc, ...applicationInterviews];
    }
    return acc;
  }, []);

  return interviews;
};
