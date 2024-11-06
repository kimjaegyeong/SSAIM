package com.e203.project.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectJiraConnectDto {
	private String jiraApi;
	private String jiraProjectId;
	@Builder
	private ProjectJiraConnectDto(String jiraApi, String jiraProjectId) {
		this.jiraApi = jiraApi;
		this.jiraProjectId = jiraProjectId;
	}
}
