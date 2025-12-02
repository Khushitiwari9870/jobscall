// src/data/resume-services.ts
import { PremiumService, CareerGuide, Testimonial } from '@/types/resume-services';

export const premiumServices: PremiumService[] = [
  {
    id: '1',
    title: 'Application Highlighter',
    description: 'Get your profile highlighted to top recruiters',
    price: '₹2,999',
    features: ['Top of search results', '3x more profile views', 'Priority support'],
    buttonText: 'Get Started',
    popular: true
  },
  {
    id: '2',
    title: 'Featured Profile',
    description: 'Showcase your profile to premium recruiters',
    price: '₹4,999',
    features: ['Premium badge', '5x more profile views', 'Direct recruiter connects'],
    buttonText: 'Get Featured'
  },
  {
    id: '3',
    title: 'Application Booster',
    description: 'Boost your job applications',
    price: '₹1,999',
    features: ['Application tracking', 'Resume matching', 'Interview preparation'],
    buttonText: 'Boost Now'
  }
];

export const careerGuides: CareerGuide[] = [
  {
    id: '1',
    title: 'Resume Formats',
    description: 'Choose the right resume format for your experience level',
    icon: '📝',
    views: 12500,
    downloads: 8500
  },
  {
    id: '2',
    title: 'Resignation Letter',
    description: 'Professional resignation letter templates',
    icon: '📄',
    views: 8900,
    downloads: 5600
  },
  // Add more career guides...
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'The resume services helped me land my dream job within weeks!',
    name: 'Priya Sharma',
    role: 'Senior Developer',
    company: 'TechCorp',
    avatar: '/avatars/1.jpg'
  },
  // Add more testimonials...
];