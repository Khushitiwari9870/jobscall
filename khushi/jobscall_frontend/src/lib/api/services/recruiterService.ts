import { apiRequest } from '../apiClient';

export interface JobData {
  title: string;
  description: string;
  requirements?: string;
  employment_type: string;
  location: string;
  is_remote?: boolean;
  min_salary?: number;
  max_salary?: number;
  skills_required?: string[];
  experience_level?: string;
  application_deadline?: string;
  status?: string;
  company?: number;
  [key: string]: unknown;
}

export interface RecruiterProfile {
  id: number;
  user: number;
  company: {
    id: number;
    name: string;
    logo?: string;
  };
  job_title: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecruiterStats {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  new_applications: number;
  interviews_scheduled: number;
  candidates_hired: number;
}

export const recruiterService = {
  // Get recruiter profile
  getProfile: async (): Promise<RecruiterProfile> => {
    return apiRequest('get', '/api/v1/recruiter/profile/');
  },

  // Update recruiter profile
  updateProfile: async (data: Partial<RecruiterProfile>): Promise<RecruiterProfile> => {
    return apiRequest('patch', '/api/v1/recruiter/profile/', data);
  },

  // Get recruiter dashboard statistics
  getDashboardStats: async (): Promise<RecruiterStats> => {
    return apiRequest('get', '/api/v1/recruiter/dashboard/stats/');
  },

  // Get recent job applications
  getRecentApplications: async (limit: number = 5) => {
    return apiRequest('get', '/api/v1/recruiter/applications/recent/', {
      params: { limit }
    });
  },

  // Get active job postings
  getActiveJobs: async () => {
    return apiRequest('get', '/api/v1/recruiter/jobs/active/');
  },

  // Create a new job posting
  createJob: async (jobData: JobData) => {
    return apiRequest('post', '/api/v1/recruiter/jobs/', jobData);
  },

  // Update a job posting
  updateJob: async (jobId: number, jobData: Partial<JobData>) => {
    return apiRequest('patch', `/api/v1/recruiter/jobs/${jobId}/`, jobData);
  },

  // Get candidates for a job
  getJobCandidates: async (jobId: number) => {
    return apiRequest('get', `/api/v1/recruiter/jobs/${jobId}/candidates/`);
  }
};
