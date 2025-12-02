import { apiRequest } from '../apiClient';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  featured_image?: string;
  categories: string[];
  tags: string[];
  published_at: string;
  updated_at: string;
  is_published: boolean;
  view_count: number;
}

export interface BlogListParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  tag?: string;
  author?: number;
  is_published?: boolean;
  ordering?: string;
}

export const blogService = {
  // Get all blog posts
  getPosts: async (params?: BlogListParams) => {
    return apiRequest<{ count: number; next: string | null; previous: string | null; results: BlogPost[] }>(
      'get',
      '/blog/',
      undefined,
      { params }
    );
  },

  // Get a single blog post by slug
  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    return apiRequest<BlogPost>('get', `/blog/${slug}/`);
  },

  // Get featured blog posts
  getFeaturedPosts: async (limit: number = 3): Promise<BlogPost[]> => {
    return apiRequest<BlogPost[]>('get', '/blog/featured/', undefined, {
      params: { limit },
    });
  },

  // Get related blog posts
  getRelatedPosts: async (postId: number, limit: number = 3): Promise<BlogPost[]> => {
    return apiRequest<BlogPost[]>('get', `/blog/${postId}/related/`, undefined, {
      params: { limit },
    });
  },

  // Increment view count for a blog post
  incrementViewCount: async (slug: string): Promise<void> => {
    await apiRequest('post', `/blog/${slug}/view/`);
  },
};
