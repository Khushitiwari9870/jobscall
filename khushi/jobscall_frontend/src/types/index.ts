export interface Company {
  id: string;
  name: string;
  logo: string;
  rating?: number;
  reviews?: number;
  location?: string;
  jobsCount?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  posted: string;
  isRemote?: boolean;
  isWalkin?: boolean;
  tags?: string[];
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  image: string;
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  discount?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
}

export interface JobCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
}
