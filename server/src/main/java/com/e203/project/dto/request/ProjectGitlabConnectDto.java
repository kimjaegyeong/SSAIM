package com.e203.project.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectGitlabConnectDto {
	String gitlabApi;

	@Builder
	private void ProjectJiraConnectDto(String gitlabApi) {
		this.gitlabApi = gitlabApi;
	}
}
