// src/types/resume-services.ts
export interface PremiumService {
    id: string;
    title: string;
    description: string;
    price: string;
    features: string[];
    buttonText: string;
    popular?: boolean;
  }
  
  export interface CareerGuide {
    id: string;
    title: string;
    description: string;
    icon: string;
    views: number;
    downloads: number;
  }
  
  export interface Testimonial {
    id: string;
    quote: string;
    name: string;
    role: string;
    company: string;
    avatar: string;
  }