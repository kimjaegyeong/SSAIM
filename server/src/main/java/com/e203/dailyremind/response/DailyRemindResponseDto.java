package com.e203.dailyremind.response;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class DailyRemindResponseDto {

    private String username;
    private String message;
    private int projectMemberId;
    private int projectId;
    private int dailyRemindId;
    private int userId;

    @Builder
    private DailyRemindResponseDto(String username, String message, int projectMemberId, int projectId, int dailyRemindId
    , int userId) {
        this.username = username;
        this.message = message;
        this.projectMemberId = projectMemberId;
        this.projectId = projectId;
        this.dailyRemindId = dailyRemindId;
        this.userId = userId;
    }
}
