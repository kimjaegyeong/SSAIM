package com.e203.weeklyremind.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WeeklyRemindResponseDto {

    private Integer projectMemberId;
    private Integer projectId;
    private String username;
    private String userImage;
    private Integer userId;
    private String projectName;
    private Integer weeklyRemindId;
    private String content;
    private LocalDate startDate;
    private LocalDate endDate;
    @Builder
    private WeeklyRemindResponseDto(Integer projectMemberId, Integer projectId, String username
    , String userImage, Integer userId, Integer weeklyRemindId, String projectName
    , String content, LocalDate startDate, LocalDate endDate) {

        this.projectMemberId = projectMemberId;
        this.projectId = projectId;
        this.username = username;
        this.userImage = userImage;
        this.userId = userId;
        this.weeklyRemindId = weeklyRemindId;
        this.projectName = projectName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.content = content;
    }
}
