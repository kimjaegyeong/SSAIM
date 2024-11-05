package com.e203.project.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectFindResponseDto {
	private int id;
	private String name;
	private String title;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
	private String jiraApi;
	private String gitlabApi;
	private Double progressFront;
	private Double progressBack;
	private List<ProjectMemberFindResponseDto> projectMemberFindResponseDtoList;

	@Builder
	private ProjectFindResponseDto(int id, String name, String title, LocalDateTime startDate, LocalDateTime endDate,
		String jiraApi, String gitlabApi,
		List<ProjectMemberFindResponseDto> projectMembers, Double progressFront, Double progressBack) {
		this.id = id;
		this.title =title;
		this.projectMemberFindResponseDtoList = projectMembers;
		this.name = name;
		this.jiraApi = jiraApi;
		this.gitlabApi = gitlabApi;
		this.startDate = startDate;
		this.endDate = endDate;
		this.progressFront = progressFront;
		this.progressBack = progressBack;
	}
}


