import { useQuery } from '@tanstack/react-query';
import { WeeklyDataDTO } from '../types/dashboard/WeeklyDataDTO';
import { useDashboardStore } from '../stores/dashboardStore';
export const useWeeklyData = () => {
  const {startDate} = useDashboardStore();
  return useQuery({
    queryKey: ['weeklyData', startDate],
    queryFn: async () => {
      // 실제 API 요청이 연결되면 fetchWeeklyData 함수 호출로 교체
      return sampleWeeklyData;
    },
    initialData: sampleWeeklyData, // 초기 렌더링 시 사용될 더미 데이터
    staleTime: Infinity, // 무한대 설정으로 초기 데이터가 계속 유지되도록 설정
  });
};

const sampleWeeklyData: WeeklyDataDTO = {
  weekStartDate: '2024-10-28',
  dailyData: [
    {
      jira: [
        { id: 1, title: 'Develop New Feature' },
        { id: 2, title: 'Fix Login Bug' },
      ],
      gitlab: [{ id: 3, title: 'Code Review for Feature X' }],
      meeting: [{ id: 4, title: 'Sprint Planning Meeting' }],
    },
    {
      jira: [{ id: 5, title: 'Refactor Codebase' }],
      gitlab: [{ id: 6, title: 'Merge Feature Branch' }],
      meeting: [{ id: 7, title: 'Team Stand-up' }],
    },
    {
      jira: [{ id: 8, title: 'Implement Unit Tests' }],
      gitlab: [{ id: 9, title: 'Push Changes to GitLab' }],
      meeting: [],
    },
    {
      jira: [{ id: 10, title: 'Update API Documentation' }],
      gitlab: [],
      meeting: [{ id: 11, title: 'Project Sync-up' }],
    },
    {
      jira: [{ id: 12, title: 'Optimize Database Queries' }],
      gitlab: [{ id: 13, title: 'Resolve Merge Conflicts' }],
      meeting: [{ id: 14, title: 'Client Feedback Review' }],
    },
    {
      jira: [],
      gitlab: [{ id: 15, title: 'Test New Features' }],
      meeting: [{ id: 16, title: 'Weekend Check-in' }],
    },
    {
      jira: [{ id: 17, title: 'Review Code Quality' }],
      gitlab: [],
      meeting: [],
    },
  ],
};

