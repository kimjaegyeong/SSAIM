package com.e203.project.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectJiraConnectDto {
	private String jiraApi;

	@Builder
	private ProjectJiraConnectDto(String jiraApi) {
		this.jiraApi = jiraApi;
	}
}
