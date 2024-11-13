import { useQuery } from '@tanstack/react-query';
import { fetchProjectInfoData } from '../apis/fetchProjectInfoData';
import { ProjectDTO } from '../types/ProjectDTO';

export const useProjectInfo = (projectId: number | null | undefined) => {
  return useQuery<ProjectDTO, Error>({
    queryKey: ['projectInfo', projectId],
    queryFn: async () => {
      console.log(projectId, 'queryFn');
      return await fetchProjectInfoData(projectId!);
    },
    initialData: {
      id: 0,
      name: '',
      title: '', // title 필드 추가
      startDate: new Date(), // Date 타입으로 설정
      endDate: new Date(), // Date 타입으로 설정
      projectMembers: [],
      projectImage: null, // 빈 문자열로 설정
      progressFront: 0,
      progressBack: 0,
      jiraApi: null,
      gitlabApi: null,
      jiraBoardId: null,
      jiraId: null,
      gitlabId: null,
    },
    enabled: projectId !== null, // projectId가 null인 경우 쿼리를 실행하지 않음
  });
};
