package com.e203.weeklyremind.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class WeeklyRemindRequestDto {

    private int projectMemberId;
    private String content;
    private LocalDate weeklyRemindDate;

    @Builder
    private WeeklyRemindRequestDto(String content, int projectMemberId, LocalDate weeklyRemindDate) {
        this.projectMemberId = projectMemberId;
        this.content = content;
        this.weeklyRemindDate = weeklyRemindDate;
    }
}
