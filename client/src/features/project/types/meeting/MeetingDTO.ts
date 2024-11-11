export interface MeetingRequestDto {
    meetingTitle: string;
    projectId: number;
}

export interface MeetingPostDTO {
    audiofile: File;
    meetingRequestDto: MeetingRequestDto;
}

export interface MeetingItemDTO {
    meetingId: number;
    projectId: number;
    meetingTitle: string;
    meetingFirstVoiceText: string;
    meetingCreateTime: string;
    meetingVoiceTime: number;
}

export interface MeetingListDTO {
    meetingItems: MeetingItemDTO[];
}