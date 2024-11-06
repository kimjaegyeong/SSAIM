package com.e203.meeting.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MeetingResponseDto {

    private int meetingId;
    private int projectId;
    private String meetingTitle;
    private String meetingVoiceUrl;
    private String meetingVoiceScript;
    private LocalDateTime meetingCreateTime;

    @Builder
    private MeetingResponseDto(int meetingId, int projectId, String meetingTitle
            , String meetingVoiceUrl, String meetingVoiceScript, LocalDateTime meetingCreateTime) {

        this.meetingId = meetingId;
        this.projectId = projectId;
        this.meetingTitle = meetingTitle;
        this.meetingVoiceUrl = meetingVoiceUrl;
        this.meetingVoiceScript = meetingVoiceScript;
        this.meetingCreateTime = meetingCreateTime;
    }
}
