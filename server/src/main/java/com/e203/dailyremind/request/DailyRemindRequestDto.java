package com.e203.dailyremind.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DailyRemindRequestDto {

    private int dailyRemindAuthor;
    private String dailyRemindContents;
    private int dailyRemindId;

    @Builder
    private DailyRemindRequestDto(int dailyRemindAuthor, String dailyRemindContents, int dailyRemindId) {
        this.dailyRemindAuthor = dailyRemindAuthor;
        this.dailyRemindContents = dailyRemindContents;
        this.dailyRemindId = dailyRemindId;
    }
}
