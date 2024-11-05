import { useQuery } from '@tanstack/react-query';
import { fetchProjectInfoData } from '../apis/fetchProjectInfoData';
export const useProjectInfo = (projectId : number) => {
  return useQuery({
    queryKey: ['projectInfo', projectId],
    queryFn: async () => {
      // console.log(userId, 'queryFn')
      if (projectId === null) return {}; // userId가 null인 경우 빈 배열 반환
      return await fetchProjectInfoData(projectId);
    },


    initialData: {}, // 초기 렌더링 시 사용될 더미 데이터
  });
};