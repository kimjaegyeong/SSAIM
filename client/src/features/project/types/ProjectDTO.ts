//src/features/project/types/ProjectDTO.ts


export interface ProjectMemberDTO {
  userId : number;
  userName : string;
  role : number;
}


export interface ProjectDTO {
  projectId: number;
  title: string;
  profileImage: string;
  startDate : Date;
  endDate: Date;
  progressFront : number;
  progressBack: number;
  teamMembers: ProjectMemberDTO[];
}