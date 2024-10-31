// src/feature/project/types/WeeklyDataDTO.ts

// TaskDTO: 각 작업의 세부 정보를 정의
export interface TaskDTO {
  id: number;
  title: string;
}

// 요일별 작업 데이터 정의
export interface DayDataDTO {
  jira: TaskDTO[];
  gitlab: TaskDTO[];
  meeting: TaskDTO[];
}

// WeeklyDataDTO: 주간 데이터를 정의하며 요일을 키로 포함
export interface WeeklyDataDTO {
  weekStartDate: string; // 주간 시작 날짜
  dailyData: {
      Monday: DayDataDTO;
      Tuesday: DayDataDTO;
      Wednesday: DayDataDTO;
      Thursday: DayDataDTO;
      Friday: DayDataDTO;
      Saturday: DayDataDTO;
      Sunday: DayDataDTO;
  };
}
