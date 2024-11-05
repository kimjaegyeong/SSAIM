package com.e203.weeklyremind.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class WeeklyRemindRequestDto {

    private int userId;
    private String content;

    @Builder
    private WeeklyRemindRequestDto(String content, int userId) {
        this.userId = userId;
        this.content = content;
    }
}
