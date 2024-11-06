import { useQuery } from '@tanstack/react-query';
import { fetchProjectInfoData } from '../apis/fetchProjectInfoData';

export const useProjectInfo = (projectId: number | null|undefined) => {
  return useQuery({
    queryKey: ['projectInfo', projectId],
    queryFn: async () => {
      console.log(projectId, 'queryFn');
      return await fetchProjectInfoData(projectId!);
    },
    initialData: {}, // 초기 렌더링 시 사용될 더미 데이터
    enabled: projectId !== null, // projectId가 null인 경우 쿼리를 실행하지 않음
  });
};
