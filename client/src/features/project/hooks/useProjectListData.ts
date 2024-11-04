import { useQuery } from '@tanstack/react-query';
import { ProjectDTO } from '../types/ProjectDTO';
import { fetchProjectListData } from '../apis/fetchProjectListData';
export const useProjectListData = (userId: number|null) => {
  return useQuery({
    queryKey: ['projectListData'],
    queryFn: async () => {
      // fetchProjectListData의 결과를 반환하도록 수정
      if (userId === null) return []; // userId가 null인 경우 빈 배열 반환
      return await fetchProjectListData(userId);
    },


    initialData: sampleProjectListData, // 초기 렌더링 시 사용될 더미 데이터
    staleTime: Infinity, // 무한대 설정으로 초기 데이터가 계속 유지되도록 설정
  });
};

const sampleProjectListData: ProjectDTO[] = [
  {
    id: 1,
    title: 'Street Coding Fighter',
    name: '가화만사성',
    profileImage: 'https://placekitten.com/100/100',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-02-01'),
    progress_front: 80,
    progress_back: 50,
    teamMembers: [
      { id: 1, userName: '여대기', role: 1, profileImage: '' },
      { id: 2, userName: '유기상', role: 0, profileImage: '' },
    ],
  },
  {
    id: 2,
    title: 'Newscrab',
    name: '기호지세',

    profileImage: 'https://placekitten.com/100/100',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-02-01'),
    progress_front: 80,
    progress_back: 50,
    teamMembers: [
      { id: 1, userName: '여대기', role: 1, profileImage: '' },
      { id: 2, userName: '유기상', role: 0, profileImage: '' },
    ],
  },
  {
    id: 3,
    title: 'SSAFY Log',
    name: '행운삼조룡',

    profileImage: 'https://placekitten.com/100/100',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-02-01'),
    progress_front: 80,
    progress_back: 50,
    teamMembers: [
      { id: 1, userName: '여대기', role: 1, profileImage: '' },
      { id: 2, userName: '유기상', role: 0, profileImage: '' },
    ],
  },
];
