package com.e203.project.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class ProjectJiraEpicDto {
	private String key;
	private String summary;

	@Builder
	private ProjectJiraEpicDto(String key, String summary) {
		this.key = key;
		this.summary = summary;
	}
}
