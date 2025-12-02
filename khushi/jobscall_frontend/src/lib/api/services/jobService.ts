import { apiRequest } from '../apiClient';
import { apiEndpoints } from '../endpoints';

export interface Company {
  id: number;
  name: string;
  logo?: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  company: Company | number;  // Can be either company object or just ID
  location: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary';
  min_salary?: number;
  max_salary?: number;
  is_remote: boolean;
  posted_on: string;
  application_deadline?: string;
  skills_required: string[];
  experience: string;
  is_active: boolean;
  category?: string;
  requirements?: string;
}

export interface JobApplication {
  id: number;
  job: number;
  applicant: number;
  status: 'applied' | 'reviewed' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  applied_date: string;
  resume: string;
  cover_letter?: string;
  message?: string;
}

export interface JobListParams {
  search?: string;
  location?: string;
  job_type?: string;
  is_remote?: boolean;
  salary_min?: number;
  salary_max?: number;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export const jobService = {
  // Get all jobs with optional filters
  getJobs: async (params?: JobListParams): Promise<{ count: number; next: string | null; previous: string | null; results: Job[] }> => {
    return apiRequest('get', apiEndpoints.jobs, undefined, { params });
  },

  // Get a single job by ID
  getJob: async (id: number): Promise<Job> => {
    return apiRequest('get', apiEndpoints.getJob(id));
  },

  // Apply to a job
  applyToJob: async (jobId: number, data: {
    resume: File;
    cover_letter?: File;
    message?: string;
  }): Promise<JobApplication> => {
    const formData = new FormData();
    formData.append('resume', data.resume);
    
    if (data.cover_letter) {
      formData.append('cover_letter', data.cover_letter);
    }
    
    if (data.message) {
      formData.append('message', data.message);
    }

    return apiRequest('post', apiEndpoints.applyToJob(jobId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get user's job applications
  getMyApplications: async (): Promise<JobApplication[]> => {
    return apiRequest('get', '/me/applications/');
  },

  // Get a specific job application
  getApplication: async (id: number): Promise<JobApplication> => {
    return apiRequest('get', `/applications/${id}/`);
  },

  // Search jobs
  getMyJobs: async (params?: JobListParams): Promise<{ count: number; next: string | null; previous: string | null; results: Job[] }> => {
    return apiRequest('get', apiEndpoints.myJobs, undefined, { params });
  },

  // Search jobs
  postJob: async (jobData: {
    title: string;
    employment_type: string;
    location: string;
    is_remote: boolean;
    min_salary?: number;
    max_salary?: number;
    description: string;
    requirements?: string;
    skills_required: string[];
    experience: string;
    category?: string;
    application_deadline?: string;
    company: number;
    posted_on: string;
    is_active: boolean;
  }): Promise<Job> => {
    return apiRequest('post', apiEndpoints.jobs, jobData);
  },

  // Search jobs
  searchJobs: async (query: string, params?: Omit<JobListParams, 'search'>): Promise<{ results: Job[] }> => {
    return apiRequest('get', '/search/', undefined, {
      params: { ...params, search: query },
    });
  },
};
