package com.e203.dailyremind.entity;

import com.e203.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "daily_remind")
public class DailyRemind extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "daily_remind_id")
    private int dailyRemindId;

    @Column(name = "daily_remind_contents")
    private String dailyRemindContents;

    @Column(name = "daily_remind_author")
    private int dailyRemindAuthor;

    @Column(name = "project_id")
    private int projectId;
}
