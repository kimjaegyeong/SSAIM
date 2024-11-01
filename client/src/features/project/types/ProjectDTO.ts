//src/features/project/types/ProjectDTO.ts


export interface ProjectDTO {
  id: number;
  title: string;
  profileImage: string;
  startDate : Date;
  endDate: Date;
  progressFront : number;
  progressBack: number;
}