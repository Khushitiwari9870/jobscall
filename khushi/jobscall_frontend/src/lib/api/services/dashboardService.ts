import apiClient from '../apiClient';
import { apiEndpoints } from '../endpoints';

export const getMyApplications = async () => {
  const response = await apiClient.get(apiEndpoints.myApplications);
  return response.data;
};

export const getDashboardStats = async () => {
  // This is a placeholder. You should replace this with the actual endpoint when available.
  // For now, we will simulate a delay and return some mock data.
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalApplications: 24,
    interviews: 8,
    offers: 2,
    activeSearches: 5,
  };
};

export const getRecentActivities = async () => {
  // This is a placeholder. You should replace this with the actual endpoint when available.
  // For now, we will simulate a delay and return some mock data.
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 1, type: 'application', title: 'Application sent', description: 'Senior Frontend Developer at TechCorp', time: '2 hours ago' },
    { id: 2, type: 'message', title: 'New message', description: 'From HR at DesignHub', time: '5 hours ago' },
    { id: 3, type: 'interview', title: 'Interview scheduled', description: 'Product Manager role at ProductLabs', time: '1 day ago' },
    { id: 4, type: 'application', title: 'Application viewed', description: 'By hiring manager at WebSolutions', time: '2 days ago' },
  ];
};
