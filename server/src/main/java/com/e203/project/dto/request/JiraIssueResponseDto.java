package com.e203.project.dto.request;

import com.e203.project.dto.jiraapi.JiraContent;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JiraIssueResponseDto {
	private String title;
	private String epicCode;
	private String progress;
	private double storyPoint;
	private String allocator;
	private String issueKey;

	@Builder
	private JiraIssueResponseDto(String issueKey, String title, String epicCode, String progress, double storyPoint, String allocator) {
		this.issueKey = issueKey;
		this.title = title;
		this.epicCode = epicCode;
		this.progress = progress;
		this.storyPoint = storyPoint;
		this.allocator = allocator;
	}

	public static JiraIssueResponseDto transferDto(JiraContent jiraContent){
		return JiraIssueResponseDto.builder()
			.title(jiraContent.getFields().getSummary())
			.epicCode(jiraContent.getFields().getEpicCode())
			.progress(jiraContent.getFields().getStatus().getProgress())
			.storyPoint(jiraContent.getFields().getStoryPoint() ==null ? 0 : jiraContent.getFields().getStoryPoint())
			.allocator(
				jiraContent.getFields().getAssignee() == null ? "할당되지 않음" : jiraContent.getFields().getAssignee().getDisplayName())
			.issueKey(jiraContent.getKey())
			.build();
	}
}
