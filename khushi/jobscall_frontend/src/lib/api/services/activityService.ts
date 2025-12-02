import apiClient from '../apiClient';
import { apiEndpoints } from '../endpoints';

export const getMyActivities = async () => {
  const response = await apiClient.get(apiEndpoints.adminActivities);
  return response.data;
};
