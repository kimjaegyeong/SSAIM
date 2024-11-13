export interface IssueCreateDTO {
  summary: string;
  description: string;
  issueType: 'Story' | 'Task';
  storyPoint: number;
  epicKey?: string | null;
  assignee?: string | null;
}
