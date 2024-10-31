package com.e203.project.entity;

import java.time.LocalDateTime;

import com.e203.global.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="project")
public class Project extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "project_id")
	private int id;

	@Column(name = "prject_title")
	private String title;

	@Column(name = "project_profile_image")
	private String profileImage;

	@Column(name = "project_start_date")
	private LocalDateTime startDate;

	@Column(name = "project_end_date")
	private LocalDateTime endDate;

	@Column(name = "project_gitlab_api")
	private String gitlabApi;

	@Column(name = "project_jira_api")
	private String jiraApi;

	@Column(name = "project_progress_front")
	private String progressFront;

	@Column(name = "project_progress_back")
	private String progressBack;

	@Builder
	private Project(String title, String profileImage, LocalDateTime startDate, LocalDateTime endDate, String gitlabApi, String jiraApi,
		String progressBack, String progressFront){
		this.title = title;
		this.profileImage = profileImage;
		this.startDate =startDate;
		this.endDate = endDate;
		this.gitlabApi = gitlabApi;
		this.jiraApi = jiraApi;
		this.progressFront = progressFront;
		this.progressBack = progressBack;
	}
}
