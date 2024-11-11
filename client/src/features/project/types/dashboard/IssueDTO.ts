export interface IssueDTO2 {
  allocator: string;
  title: string;
  status: '해야 할 일' | '진행 중' | '완료';
  epicCode: string;
  storyPoint: number;
  issueKey: string;
}
