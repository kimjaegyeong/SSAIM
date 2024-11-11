export interface MeetingRequestDto {
    meetingTitle: string;
    projectId: number;
}

export interface MeetingPostDTO {
    audiofile: File;
    meetingRequestDto: MeetingRequestDto;
}
