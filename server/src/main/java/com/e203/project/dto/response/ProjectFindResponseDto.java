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
	private LocalDateTime startDate;
	private LocalDateTime endDate;
	private String jiraApi;
	private String gitlabApi;
	private Double progress_front;
	private Double progress_back;
	private List<ProjectMemberFindResponseDto> projectMemberFindResponseDtoList;

	@Builder
	private ProjectFindResponseDto(int id, String name, LocalDateTime startDate, LocalDateTime endDate,
		String jiraApi, String gitlabApi,
		List<ProjectMemberFindResponseDto> projectMembers, Double progress_front, Double progress_back) {
		this.id = id;
		this.projectMemberFindResponseDtoList = projectMembers;
		this.name = name;
		this.jiraApi = jiraApi;
		this.gitlabApi = gitlabApi;
		this.startDate = startDate;
		this.endDate = endDate;
		this.progress_front = progress_front;
		this.progress_back = progress_back;
	}
}


