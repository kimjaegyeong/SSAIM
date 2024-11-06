package com.e203.meeting.entity;

import com.e203.global.entity.BaseEntity;
import com.e203.project.entity.Project;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "meeting")
public class Meeting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_id")
    private int meetingId;

    @Column(name = "meeting_title")
    private String meetingTitle;

    @Column(name = "meeting_voice_url")
    private String meetingVoiceUrl;

    @Lob
    @Column(columnDefinition = "TEXT", name = "meeting_voice_script")
    private String meetingVoiceScript;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project projectId;
}
