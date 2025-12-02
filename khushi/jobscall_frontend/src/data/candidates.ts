export interface Education {
  degree: string;
  university: string;
  year: string;
}

import { Candidate } from '@/types/candidate';

export const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    title: 'Senior Software Engineer',
    experience: { years: 5, months: 10 },
    currentCTC: 18.5,
    expectedCTC: 22.0,
    noticePeriod: '30 days',
    location: 'Bangalore, India',
    currentCompany: 'Tech Solutions Inc.',
    currentRole: 'Senior Software Engineer',
    previousCompany: 'WebTech Solutions',
    education: {
      degree: 'B.Tech in Computer Science',
      university: 'IIT Bombay',
      year: '2018'
    },
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'GraphQL'],
    relatedSkills: ['Redux', 'Express', 'Docker'],
    isImmediateJoiner: true,
    isActivelyLooking: true,
    lastActive: '2 days ago',
    profileViews: 42,
    lastUpdated: '2 hours ago',
    preferredLocations: ['Bangalore', 'Hyderabad', 'Pune'],
    isShortlisted: false,
  },
  {
    id: '2',
    name: 'Priya Patel',
    title: 'Senior UX Designer',
    experience: { years: 4, months: 2 },
    currentCTC: 15.5,
    expectedCTC: 18.0,
    noticePeriod: '60 days',
    location: 'Mumbai, India',
    currentCompany: 'DesignHub',
    currentRole: 'Senior UX Designer',
    previousCompany: 'UI Masters',
    education: {
      degree: 'M.Des in Interaction Design',
      university: 'NID Ahmedabad',
      year: '2019'
    },
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'UI/UX', 'Design Systems'],
    relatedSkills: ['Adobe XD', 'InVision', 'Framer'],
    isImmediateJoiner: false,
    isActivelyLooking: true,
    lastActive: '1 day ago',
    profileViews: 38,
    lastUpdated: '5 hours ago',
    preferredLocations: ['Mumbai', 'Pune', 'Remote'],
    isShortlisted: false,
  },
  {
    id: '3',
    name: 'Amit Kumar',
    title: 'DevOps Lead',
    preferredLocations: ['Bangalore', 'Hyderabad', 'Gurgaon'],
    isShortlisted: false,
    experience: { years: 6, months: 6 },
    currentCTC: 22.0,
    expectedCTC: 28.0,
    noticePeriod: '90 days',
    location: 'Hyderabad, India',
    currentCompany: 'CloudTech Solutions',
    currentRole: 'DevOps Lead',
    previousCompany: 'InfraScale',
    education: {
      degree: 'B.E. in Computer Science',
      university: 'BITS Pilani',
      year: '2016'
    },
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux'],
    relatedSkills: ['Azure', 'GCP', 'Ansible'],
    isImmediateJoiner: true,
    isActivelyLooking: false,
    lastActive: '3 days ago',
    profileViews: 29,
    lastUpdated: '1 day ago',
    isStarred: false
  },
  {
    id: '4',
    name: 'Anjali Mehta',
    title: 'Data Scientist',
    experience: { years: 3, months: 6 },
    currentCTC: 18.0,
    expectedCTC: 22.0,
    noticePeriod: '30 days',
    location: 'Bangalore, India',
    currentCompany: 'DataInsights',
    currentRole: 'Data Scientist',
    education: {
      degree: 'M.Tech in Data Science',
      university: 'IIIT Bangalore',
      year: '2020'
    },
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'SQL', 'Pandas'],
    relatedSkills: ['PyTorch', 'Scikit-learn', 'Data Visualization'],
    isImmediateJoiner: false,
    isActivelyLooking: true,
    lastActive: '5 hours ago',
    profileViews: 35,
    lastUpdated: '3 hours ago',
    preferredLocations: ['Bangalore', 'Pune', 'Hyderabad'],
    isShortlisted: false,
  },
  {
    id: '5',
    name: 'Vikram Singh',
    title: 'Senior Product Manager',
    experience: { years: 7, months: 2 },
    currentCTC: 28.0,
    expectedCTC: 35.0,
    noticePeriod: '60 days',
    location: 'Delhi, India',
    currentCompany: 'ProductLabs',
    currentRole: 'Senior Product Manager',
    previousCompany: 'TechVentures',
    education: {
      degree: 'MBA in Technology Management',
      university: 'IIM Ahmedabad',
      year: '2017'
    },
    skills: ['Product Strategy', 'Agile', 'Jira', 'Market Research', 'Roadmapping', 'Stakeholder Management'],
    relatedSkills: ['Product Analytics', 'A/B Testing', 'User Stories'],
    isImmediateJoiner: false,
    isActivelyLooking: false,
    lastActive: '3 days ago',
    profileViews: 24,
    lastUpdated: '2 days ago',
    isStarred: false,
    preferredLocations: ['Delhi NCR', 'Gurgaon', 'Noida', 'Remote'],
    isShortlisted: false
  },
  {
    id: '6',
    name: 'Neha Gupta',
    title: 'Frontend Developer',
    experience: { years: 2, months: 5 },
    currentCTC: 12.5,
    expectedCTC: 15.0,
    noticePeriod: '30 days',
    location: 'Pune, India',
    currentCompany: 'DigitalCraft',
    currentRole: 'Frontend Developer',
    education: {
      degree: 'B.Tech in Computer Engineering',
      university: 'COEP Pune',
      year: '2021'
    },
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'Responsive Design'],
    relatedSkills: ['Next.js', 'TypeScript', 'Styled Components'],
    isImmediateJoiner: true,
    isActivelyLooking: true,
    lastActive: '1 hour ago',
    profileViews: 18,
    lastUpdated: '30 minutes ago',
    preferredLocations: ['Pune', 'Mumbai', 'Remote'],
    isShortlisted: false,
  },
  {
    id: '7',
    name: 'Rajesh Kumar',
    title: 'Engineering Manager',
    experience: { years: 8, months: 0 },
    currentCTC: 32.5,
    expectedCTC: 40.0,
    noticePeriod: '90 days',
    location: 'Bangalore, India',
    currentCompany: 'CloudScale',
    currentRole: 'Engineering Manager',
    previousCompany: 'TechMasters',
    education: {
      degree: 'M.Tech in Software Engineering',
      university: 'IIT Delhi',
      year: '2015'
    },
    skills: ['Team Leadership', 'System Design', 'Microservices', 'Cloud Architecture', 'Agile', 'Mentoring'],
    relatedSkills: ['Performance Optimization', 'Code Review', 'Technical Roadmapping'],
    isImmediateJoiner: false,
    isActivelyLooking: true,
    lastActive: '2 days ago',
    profileViews: 31,
    lastUpdated: '1 day ago',
    isStarred: false,
    preferredLocations: ['Bangalore', 'Hyderabad', 'Pune', 'Remote'],
    isShortlisted: false
  },
  {
    id: '8',
    name: 'Sneha Reddy',
    title: 'Data Engineer',
    experience: { years: 4, months: 8 },
    currentCTC: 20.0,
    expectedCTC: 25.0,
    noticePeriod: '30 days',
    location: 'Hyderabad, India',
    currentCompany: 'DataWave',
    currentRole: 'Data Engineer',
    previousCompany: 'InfoSystems',
    education: {
      degree: 'B.Tech in Information Technology',
      university: 'IIIT Hyderabad',
      year: '2019'
    },
    skills: ['Python', 'SQL', 'ETL', 'Data Pipelines', 'Apache Spark', 'Big Data'],
    relatedSkills: ['AWS Glue', 'Airflow', 'Kafka'],
    isImmediateJoiner: true,
    isActivelyLooking: false,
    lastActive: '12 hours ago',
    profileViews: 27,
    lastUpdated: '5 hours ago',
    preferredLocations: ['Hyderabad', 'Bangalore', 'Remote'],
    isShortlisted: false
  }
];

// Import the type from the component file
import type { FilterSection } from '../components/SidebarFilters';

export const filters: { sections: FilterSection[] } = {
  sections: [
    {
      id: 'show',
      title: 'Show',
      type: 'radio',
      options: ['All Profiles', 'Shortlisted', 'Rejected', 'New', 'Contacted'].map(option => ({
        id: option.toLowerCase().replace(/ /g, '-'),
        label: option,
        count: 0
      }))
    },
    {
      id: 'duration',
      title: 'Posted',
      type: 'radio',
      options: ['Last 7 days', 'Last 15 days', 'Last 30 days', 'Last 60 days', 'Last 90 days'].map(option => ({
        id: option.toLowerCase().replace(/ /g, '-'),
        label: option,
        count: 0
      }))
    },
    {
      id: 'experience',
      title: 'Experience',
      type: 'range',
      min: 0,
      max: 30,
      step: 1
    },
    {
      id: 'skills',
      title: 'Skills',
      type: 'checkbox',
      options: [
        { id: 'react', label: 'React', count: 25 },
        { id: 'node', label: 'Node.js', count: 18 },
        { id: 'python', label: 'Python', count: 22 },
        { id: 'aws', label: 'AWS', count: 15 },
        { id: 'java', label: 'Java', count: 20 }
      ]
    }
  ]
};
