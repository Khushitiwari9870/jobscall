export interface Education {
  degree: string;
  university: string;
  year: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;  // Job title/role
  experience: {
    years: number;
    months: number;
  };
  currentCTC: number;
  expectedCTC: number;
  noticePeriod: string;  // e.g., '15 days', '1 month', '2 months', etc.
  location: string;
  currentCompany: string;
  currentRole?: string;
  previousCompany?: string;
  education: Education;
  skills: string[];
  relatedSkills?: string[];
  isImmediateJoiner: boolean;
  isActivelyLooking: boolean;
  lastActive: string;
  profileViews: number;
  lastUpdated: string;
  
  // Newly added properties
  preferredLocations: string[];
  summary?: string;
  isStarred?: boolean;
  isShortlisted: boolean;
}
