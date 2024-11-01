package com.e203.weeklyremind.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class WeeklyRemindResponseDto {

    private int author;
    private int projectId;
    private String content;

    @Builder
    WeeklyRemindResponseDto(int author, int projectId, String content) {

        this.author = author;
        this.projectId = projectId;
        this.content = content;
    }
}
