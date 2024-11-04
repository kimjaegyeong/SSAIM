package com.e203.weeklyremind.entity;

import com.e203.global.entity.BaseEntity;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project projectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_remind_author")
    private ProjectMember remindAuthor;

    @Builder
    private WeeklyRemind(String weeklyRemindContents, Project projectId, ProjectMember remindAuthor) {
        this.weeklyRemindContents = weeklyRemindContents;
        this.projectId = projectId;
        this.remindAuthor = remindAuthor;
    }

}
