import { useQuery } from '@tanstack/react-query';
import { ProjectDTO } from '../types/ProjectDTO';
export const useProjectListData = () => {
  return useQuery({
    queryKey: ['projectListData'],
    queryFn: async () => {
      return sampleProjectListData;
    },
    initialData: sampleProjectListData, // 초기 렌더링 시 사용될 더미 데이터
    staleTime: Infinity, // 무한대 설정으로 초기 데이터가 계속 유지되도록 설정
  });
};

const sampleProjectListData: ProjectDTO[] = [
  {
    projectId: 1,
    title: 'Street Coding Fighter',
    profileImage: 'https://placekitten.com/100/100',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-02-01'),
    progressFront: 80,
    progressBack: 50,
    teamMembers: [
      {userId : 1, userName : "여대기", role : 1},
      {userId : 2, userName : "유기상", role : 0},
      {userId : 3, userName : "허일영", role : 0},
      {userId : 4, userName : "전성현", role : 0},
      {userId : 5, userName : "타마요", role : 0},
      {userId : 6, userName : "마레이", role : 0},
    ]
  },
  {
    projectId: 2,
    title: 'Newscrab',
    profileImage: 'https://placekitten.com/100/100',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-02-01'),
    progressFront: 80,
    progressBack: 50,
    teamMembers: [
      {userId : 1, userName : "여대기", role : 1},
      {userId : 2, userName : "유기상", role : 0},
      {userId : 3, userName : "허일영", role : 0},
      {userId : 4, userName : "전성현", role : 0},
      {userId : 5, userName : "타마요", role : 0},
      {userId : 6, userName : "마레이", role : 0},
    ]

  },
  {
    projectId: 3,
    title: 'SSAFY Log',
    profileImage: 'https://placekitten.com/100/100',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-02-01'),
    progressFront: 80,
    progressBack: 50,
    teamMembers: [
      {userId : 1, userName : "여대기", role : 1},
      {userId : 2, userName : "유기상", role : 0},
      {userId : 3, userName : "허일영", role : 0},
      {userId : 4, userName : "전성현", role : 0},
      {userId : 5, userName : "타마요", role : 0},
      {userId : 6, userName : "마레이", role : 0},
    ]

  },
];
