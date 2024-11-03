package com.e203.dailyremind.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DailyRemindRequestDto {

    private int dailyRemindAuthor;
    private String dailyRemindContents;

    @Builder
    public DailyRemindRequestDto(int dailyRemindAuthor, String dailyRemindContents) {
        this.dailyRemindAuthor = dailyRemindAuthor;
        this.dailyRemindContents = dailyRemindContents;
    }
}
