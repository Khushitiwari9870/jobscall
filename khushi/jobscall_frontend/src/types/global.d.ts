import React from 'react';

type JSXElement = React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;

export interface WalkInJobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  experience?: string;
  jobType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  walkInDate: string;
  walkInTime: string;
  contactEmail?: string;
  contactPhone?: string;
  applicationDeadline?: string;
  skills?: string[];
  education?: string;
  vacancies?: number;
  benefits?: string[];
  isActive?: boolean;
}

declare global {
  namespace JSX {
    type Element = JSXElement;
    interface IntrinsicElements {
      [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
