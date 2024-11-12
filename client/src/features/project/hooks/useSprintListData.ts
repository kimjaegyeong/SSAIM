import { useQuery } from '@tanstack/react-query';
import { fetchSprintListData } from '../apis/fetchSprintListData';

export const useSprintListData = (projectId: number) => {
  return useQuery({
    queryKey: ['sprintList', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      return await fetchSprintListData(projectId);
    },
  });
};
