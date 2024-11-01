package com.e203.weeklyremind.entity;

import com.e203.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "weekly_remind")
public class WeeklyRemind extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weekly_remind_id")
    private int weeklyRemindId;

    @Lob
    @Column(columnDefinition = "TEXT", name = "weekly_remind_contents")
    private String weeklyRemindContents;

    @Column(name = "project_id")
    private int projectId;

    @Column(name = "weekly_remind_author")
    private int remindAuthor;

    @Builder
    private WeeklyRemind(String weeklyRemindContents, int projectId, int remindAuthor) {
        this.weeklyRemindContents = weeklyRemindContents;
        this.projectId = projectId;
        this.remindAuthor = remindAuthor;
    }

}
