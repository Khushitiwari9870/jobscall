import { apiRequest } from '../apiClient';

export interface SearchResult {
  id: number;
  title: string;
  description: string;
  url: string;
  type: 'job' | 'company' | 'blog' | 'user';
  score?: number;
  highlight?: {
    [key: string]: string[];
  };
  metadata?: Record<string, unknown>;
}

export interface SearchParams {
  query: string;
  filters?: {
    type?: ('job' | 'company' | 'blog' | 'user')[];
    location?: string[];
    salary_min?: number;
    salary_max?: number;
    job_type?: string[];
    experience_level?: string[];
    posted_within?: number; // days
    company_size?: string[];
    industry?: string[];
  };
  page?: number;
  page_size?: number;
  sort_by?: 'relevance' | 'date' | 'salary';
  sort_order?: 'asc' | 'desc';
}

export const searchService = {
  // Unified search across all content types
  unifiedSearch: async (params: SearchParams) => {
    const { query, filters = {}, page = 1, page_size = 10, sort_by, sort_order } = params;
    
    const queryParams: Record<string, string | number | string[] | undefined> = {
      q: query,
      page,
      page_size,
      ...filters,
    };

    if (sort_by) {
      queryParams.ordering = sort_order === 'desc' ? `-${sort_by}` : sort_by;
    }

    return apiRequest<{
      count: number;
      next: string | null;
      previous: string | null;
      results: SearchResult[];
      facets?: Record<string, { [key: string]: number }>;
    }>('get', '/search/', undefined, { params: queryParams });
  },

  // Search jobs with advanced filters
  searchJobs: async (query: string, filters: Omit<SearchParams['filters'], 'type'> = {}, options: Omit<SearchParams, 'query' | 'filters'> = {}) => {
    return searchService.unifiedSearch({
      query,
      filters: { ...filters, type: ['job'] },
      ...options,
    });
  },

  // Search companies
  searchCompanies: async (query: string, options: Omit<SearchParams, 'query' | 'filters'> = {}) => {
    return searchService.unifiedSearch({
      query,
      filters: { type: ['company'] },
      ...options,
    });
  },

  // Search blog posts
  searchBlogs: async (query: string, options: Omit<SearchParams, 'query' | 'filters'> = {}) => {
    return searchService.unifiedSearch({
      query,
      filters: { type: ['blog'] },
      ...options,
    });
  },

  // Get search suggestions
  getSuggestions: async (query: string, limit: number = 5) => {
    return apiRequest<{ suggestions: string[] }>('get', '/search/suggestions/', undefined, {
      params: { q: query, limit },
    });
  },

  // Get search filters and facets
  getSearchFilters: async () => {
    return apiRequest<{
      locations: string[];
      job_types: string[];
      experience_levels: string[];
      company_sizes: string[];
      industries: string[];
    }>('get', '/search/filters/');
  },
};
