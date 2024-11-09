import { useQuery } from '@tanstack/react-query';
import { fetchSprintIssueData } from '../apis/fetchSprintIssueData';

export const useSprintIssueQuery = (projectId: number, startDate: string|null, endDate: string|null) => {
  return useQuery({
    queryKey: ['sprintIssues', projectId, startDate, endDate],
    queryFn: async () => {
      if (!projectId || !startDate || !endDate) return [];
      return await fetchSprintIssueData(projectId, startDate, endDate);
    },
  });
};
