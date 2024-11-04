package com.e203.weeklyremind.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class WeeklyRemindResponseDto {

    private int authorId;
    private int projectId;
    private int weeklyRemindId;
    private String content;
    private String author;

    @Builder
    WeeklyRemindResponseDto(int authorId, int projectId, int weeklyRemindId, String content, String author) {

        this.weeklyRemindId = weeklyRemindId;
        this.authorId = authorId;
        this.projectId = projectId;
        this.content = content;
        this.author = author;
    }
}
