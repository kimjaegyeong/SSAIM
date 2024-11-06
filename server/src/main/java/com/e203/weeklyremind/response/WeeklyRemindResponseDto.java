package com.e203.weeklyremind.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class WeeklyRemindResponseDto {

    private int projectMemberId;
    private int projectId;
    private int weeklyRemindId;
    private String content;
    private String username;
    private String userImage;
    private LocalDate startDate;
    private LocalDate endDate;

    @Builder
    private WeeklyRemindResponseDto(int projectMemberId, int projectId, int weeklyRemindId, String content, String username
    , String userImage, LocalDate startDate, LocalDate endDate) {

        this.weeklyRemindId = weeklyRemindId;
        this.projectMemberId = projectMemberId;
        this.projectId = projectId;
        this.content = content;
        this.username = username;
        this.userImage = userImage;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
