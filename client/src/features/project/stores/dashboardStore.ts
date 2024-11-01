// src/stores/dashboardStore.ts

import { create } from 'zustand';
import { TaskType } from '../types/dashboard/TaskTypes';
import { DayOfWeek } from '../types/dashboard/DayOfWeek';

interface DashboardState {
  weekdayIndex: { [key: string]: number };

  taskStatus: {
      [day in DayOfWeek]: {
          [task in TaskType]: boolean;
      };
  };
  startDate: string; // 현재 주의 시작 날짜 추가
  setStartDate: (date: string) => void; // 날짜를 업데이트하는 함수
  toggleTask: (day: DayOfWeek, taskType: TaskType) => void;
}

// Zustand store 생성
export const useDashboardStore = create<DashboardState>((set) => ({
  weekdayIndex: {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  },

  taskStatus: {
    Monday: { jira: false, gitlab: false, meeting: false },
    Tuesday: { jira: false, gitlab: false, meeting: false },
    Wednesday: { jira: false, gitlab: false, meeting: false },
    Thursday: { jira: false, gitlab: false, meeting: false },
    Friday: { jira: false, gitlab: false, meeting: false },
    Saturday: { jira: false, gitlab: false, meeting: false },
    Sunday: { jira: false, gitlab: false, meeting: false },
  },
  toggleTask: (day, taskType) =>
    set((state) => ({
      taskStatus: {
        ...state.taskStatus,
        [day]: {
          ...state.taskStatus[day],
          [taskType]: !state.taskStatus[day][taskType],
        },
      },
    })),
  startDate: '2024-10-28', // 초기값 설정
  setStartDate: (date) => set(() => ({ startDate: date })), // startDate 업데이트 함수
}));
