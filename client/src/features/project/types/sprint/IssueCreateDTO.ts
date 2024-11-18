export interface IssueCreateDTO {
  id? : string;
  summary: string;
  description: string;
  issueType: 'Story' | 'Task';
  storyPoint: number;
  epic?: string | null;
  epicKey?: string | null; // epicKey 추가

  assignee?: string | null;
}
