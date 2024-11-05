// src/features/project/types/ProjectDTO.ts

export interface ProjectMemberDTO {
  id: number;
  role: 0|1;
  // userName: string;
  profileImage : string|null;
}
export interface ProjectInfoMemberDTO {
  pmId : number;
  userId : number;
  name : string;
  role : 0|1;
  profileImage : string|null;
}
// 공통 프로젝트 속성 인터페이스 정의
interface BaseProjectDTO {
  title: string;
  name: string;
  profileImage: string;
  startDate: string | null | Date;
  endDate: string | null | Date;
}

// ProjectCreateDTO에서 공통 속성 상속
export interface ProjectCreateDTO extends BaseProjectDTO{
  teamMembers: ProjectMemberDTO[] | null;
}

// ProjectDTO에서 공통 속성 상속 및 고유 필드 추가
export interface ProjectDTO extends BaseProjectDTO {
  id : number;
  progressFront: number;
  progressBack: number;
  // teamMembers 배열이 항상 null이 아닌 경우 타입에서 | null 제거 가능
  projectMemberFindResponseDtoList: ProjectInfoMemberDTO[]|null;
  jiraApi : string;
  gitlabApi : string;
}
