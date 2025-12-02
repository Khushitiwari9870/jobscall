import { apiRequest } from '../apiClient';

export interface UserProfile {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    date_joined: string;
  };
  headline?: string;
  bio?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  date_of_birth?: string;
  profile_picture?: string;
  cover_photo?: string;
  website_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  skills: string[];
  languages: Array<{
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }>;
  experience: Array<{
    id: number;
    title: string;
    company: string;
    location?: string;
    current: boolean;
    start_date: string;
    end_date?: string;
    description?: string;
  }>;
  education: Array<{
    id: number;
    school: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date?: string;
    grade?: string;
    description?: string;
  }>;
  certifications: Array<{
    id: number;
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiration_date?: string;
    credential_id?: string;
    credential_url?: string;
  }>;
  projects: Array<{
    id: number;
    name: string;
    description: string;
    url?: string;
    start_date: string;
    end_date?: string;
    currently_working: boolean;
  }>;
  resume?: string;
  is_public: boolean;
  is_available_for_work: boolean;
  preferred_job_types: string[];
  preferred_locations: string[];
  salary_expectation?: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  headline?: string;
  bio?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  date_of_birth?: string;
  website_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  skills?: string[];
  is_public?: boolean;
  is_available_for_work?: boolean;
  preferred_job_types?: string[];
  preferred_locations?: string[];
  salary_expectation?: number;
}

export const profileService = {
  // Get current user's profile
  getMyProfile: async (): Promise<UserProfile> => {
    return apiRequest<UserProfile>('get', '/profile/me/');
  },

  // Get a user's public profile by ID or username
  getUserProfile: async (identifier: string | number): Promise<UserProfile> => {
    return apiRequest<UserProfile>('get', `/profiles/${identifier}/`);
  },

  // Update current user's profile
  updateMyProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    return apiRequest<UserProfile>('patch', '/profile/me/', data);
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<{ profile_picture: string }> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    return apiRequest<{ profile_picture: string }>(
      'patch',
      '/profile/me/picture/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Upload cover photo
  uploadCoverPhoto: async (file: File): Promise<{ cover_photo: string }> => {
    const formData = new FormData();
    formData.append('cover_photo', file);
    
    return apiRequest<{ cover_photo: string }>(
      'patch',
      '/profile/me/cover-photo/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Upload resume
  uploadResume: async (file: File): Promise<{ resume: string }> => {
    const formData = new FormData();
    formData.append('resume', file);
    
    return apiRequest<{ resume: string }>(
      'patch',
      '/profile/me/resume/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Delete resume
  deleteResume: async (): Promise<void> => {
    return apiRequest('delete', '/profile/me/resume/');
  },

  // Add experience
  addExperience: async (data: Omit<UserProfile['experience'][0], 'id'>): Promise<UserProfile['experience'][0]> => {
    return apiRequest<UserProfile['experience'][0]>('post', '/profile/me/experience/', data);
  },

  // Update experience
  updateExperience: async (id: number, data: Partial<Omit<UserProfile['experience'][0], 'id'>>): Promise<UserProfile['experience'][0]> => {
    return apiRequest<UserProfile['experience'][0]>(`patch`, `/profile/me/experience/${id}/`, data);
  },

  // Delete experience
  deleteExperience: async (id: number): Promise<void> => {
    return apiRequest('delete', `/profile/me/experience/${id}/`);
  },

  // Add education
  addEducation: async (data: Omit<UserProfile['education'][0], 'id'>): Promise<UserProfile['education'][0]> => {
    return apiRequest<UserProfile['education'][0]>('post', '/profile/me/education/', data);
  },

  // Update education
  updateEducation: async (id: number, data: Partial<Omit<UserProfile['education'][0], 'id'>>): Promise<UserProfile['education'][0]> => {
    return apiRequest<UserProfile['education'][0]>(`patch`, `/profile/me/education/${id}/`, data);
  },

  // Delete education
  deleteEducation: async (id: number): Promise<void> => {
    return apiRequest('delete', `/profile/me/education/${id}/`);
  },
};
