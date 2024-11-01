package com.e203.weeklyremind.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class WeeklyRemindResponseDto {

    private String content;

    @Builder
    WeeklyRemindResponseDto(String content) {
        this.content = content;
    }
}
