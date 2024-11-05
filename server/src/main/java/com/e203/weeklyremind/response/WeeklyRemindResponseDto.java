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
    private String author;
    private String userImage;
    private LocalDate weeklyRemindDate;

    @Builder
    private WeeklyRemindResponseDto(int projectMemberId, int projectId, int weeklyRemindId, String content, String author
    , String userImage, LocalDate weeklyRemindDate) {

        this.weeklyRemindId = weeklyRemindId;
        this.projectMemberId = projectMemberId;
        this.projectId = projectId;
        this.content = content;
        this.author = author;
        this.userImage = userImage;
        this.weeklyRemindDate = weeklyRemindDate;
    }
}
