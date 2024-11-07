package com.e203.project.dto.request;

import com.e203.project.dto.jiraapi.JiraIssue;

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

	public static JiraIssueResponseDto transferDto(JiraIssue jiraIssue){
		return JiraIssueResponseDto.builder()
			.title(jiraIssue.getFields().getSummary())
			.epicCode(jiraIssue.getFields().getEpicCode())
			.progress(jiraIssue.getFields().getStatus().getProgress())
			.storyPoint(jiraIssue.getFields().getStoryPoint() ==null ? 0 : jiraIssue.getFields().getStoryPoint())
			.allocator(jiraIssue.getFields().getAssignee() == null ? "할당되지 않음" : jiraIssue.getFields().getAssignee().getDisplayName())
			.issueKey(jiraIssue.getKey())
			.build();
	}
}
