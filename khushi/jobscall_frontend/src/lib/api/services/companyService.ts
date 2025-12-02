import { apiRequest } from '../apiClient';

export interface Company {
  id: number;
  name: string;
  description: string;
  website?: string;
  logo?: string;
  industry?: string;
  company_size?: string;
  founded_year?: number;
  location?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyListParams {
  search?: string;
  industry?: string;
  company_size?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export const companyService = {
  // Get all companies with optional filters
  getCompanies: async (params?: CompanyListParams): Promise<{ count: number; next: string | null; previous: string | null; results: Company[] }> => {
    return apiRequest('get', '/api/v1/companies/companies/', undefined, { params });
  },

  // Get a single company by ID
  getCompany: async (id: number): Promise<Company> => {
    return apiRequest('get', `/api/v1/companies/companies/${id}/`);
  },

  // Create a new company (for recruiters)
  createCompany: async (data: Omit<Company, 'id' | 'is_verified' | 'created_at' | 'updated_at'>): Promise<Company> => {
    return apiRequest('post', '/api/v1/companies/companies/', data);
  },

  // Update a company (admin or company owner)
  updateCompany: async (id: number, data: Partial<Omit<Company, 'id' | 'is_verified' | 'created_at' | 'updated_at'>>): Promise<Company> => {
    return apiRequest('patch', `/api/v1/companies/companies/${id}/`, data);
  },

  // Search companies
  searchCompanies: async (query: string, params?: Omit<CompanyListParams, 'search'>): Promise<{ results: Company[] }> => {
    return apiRequest('get', '/api/v1/companies/companies/search/', undefined, {
      params: { ...params, search: query },
    });
  },

  // Get featured companies
  getFeaturedCompanies: async (limit: number = 10): Promise<Company[]> => {
    return apiRequest('get', '/api/v1/companies/companies/featured/', undefined, {
      params: { limit },
    });
  },
};
