export interface Course {
  id: string;
  type: 'Course' | 'Assessment with Certification';
  title: string;
  provider: string;
  rating: number;
  duration: string;
  hours: number;
  mode: 'Online' | 'Offline' | 'Hybrid';
  price: number;
  originalPrice: number;
  discount: number;
}

export interface Advantage {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FooterLink {
  title: string;
  links: { label: string; url: string }[];
}
