export interface DailyRemindPostDTO {
    dailyRemindContents: string;
    projectMemberId: number;
    dailyRemindDate: string; // ISO 형식의 날짜 문자열 (예: "2024-11-06")
  }