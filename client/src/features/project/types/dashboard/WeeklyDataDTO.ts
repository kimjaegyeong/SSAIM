// src/feature/project/types/WeeklyDataDTO.ts
// TaskDTO: 각 작업의 세부 정보를 정의
export interface TaskDTO {
  id: number;
  title: string;
}

export interface JiraDTO extends TaskDTO {
  taskType: 'jira';
  priority: 'low' | 'medium' | 'high'; 
  epic : string;
}

export interface DayDataDTO {
  jira: JiraDTO[];
  gitlab: TaskDTO[];
  meeting: TaskDTO[];
}

export interface WeeklyDataDTO {
  dailyData: DayDataDTO[];
  todoList : JiraDTO[];
}
export interface IssueDTO extends TaskDTO {
  allocator: string;
  title: string;
  progress: '해야 할 일' | '진행 중' | '완료';
  epicCode: string;
  storyPoint: number;
  issueKey: string;
}
export interface GitlabDTO extends TaskDTO {
  mergeDate : Date;

}
