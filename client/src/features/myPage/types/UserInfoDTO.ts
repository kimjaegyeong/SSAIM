export interface UserInfoDTO {
  userId: number;
  userName: string;
  userEmail: string;
  userClass: number;
  userCampus: number;
  userGeneration: number;
  userNickname: string;
  userProfileMessage: string|null;
  userSkills: string|null;
  userRole: number;
  userBirth: string;
  userGender: number;
  userPhone: string;
  userProfileImage: string;
}

export interface UserInfoEditDTO {
  userEmail?: string;
  userName?: string;
  userNickname?: string;
  userPhone?: string;
  userGender?: number;
  userGeneration?: number;
  userClass?: number;
  userCampus?: number;
  userBirth?: string;
  userProfileMessage?: string;
  userSkills?: string;
  userRole?: number;
  userProfileImage?: string;
}
