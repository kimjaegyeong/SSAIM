// src/stores/dashboardStore.ts

import { create } from 'zustand';
import { TaskType } from '../types/dashboard/TaskTypes';
import { DayOfWeek } from '../types/dashboard/DayOfWeek';
// import { ProjectDTO} from '../types/ProjectDTO';
import calculateWeeks from '../utils/calculateWeeks';
interface DashboardState {
  // projectInfo : ProjectDTO;
  projectId: number;
  setProjectId: (id: number) => void;
  currentWeek: number;
  setCurrentWeek: (idx: number) => void;
  projectWeekList: Array<{ startDate: Date; endDate: Date }>;
  setProjectWeek: (startDate: Date, endDate: Date) => void;
  weekdayIndex: { [key: string]: number };
  taskStatus: {
    [day in DayOfWeek]: {
      [task in TaskType]: boolean;
    };
  };
  startDate: string; // 현재 주의 시작 날짜 추가
  // endDate : string;
  setStartDate: (date: string) => void; // 날짜를 업데이트하는 함수
  toggleTask: (day: DayOfWeek, taskType: TaskType) => void;
}

// Zustand store 생성
export const useDashboardStore = create<DashboardState>((set) => ({
  projectId: 35,
  setProjectId: (id) => {
    set(() => ({ projectId: id }));
    console.log(id);
  },
  currentWeek: 0,
  setCurrentWeek: (idx) => {
    set(() => ({ currentWeek: idx }));
    console.log(idx);
  },
  projectWeekList: [],
  setProjectWeek: (start?: Date, end?: Date) => {
    if (start && end) {
      // start와 end가 모두 정의된 경우에만 실행
      const weeks = calculateWeeks(start, end);
      set({ projectWeekList: weeks });
      set({ currentWeek: weeks.length - 1 });
      console.log(calculateWeeks(start!, end!));
    } else {
      console.warn('Invalid date range provided');
    }
  },

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
