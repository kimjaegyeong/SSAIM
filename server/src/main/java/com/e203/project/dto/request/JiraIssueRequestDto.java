package com.e203.project.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JiraIssueRequestDto {
	private String issueKey;
	private String summary;
	private String description;
	private String assignee;
	private String issueType;
	private String epicKey;
	private int storyPoint;

	@Builder
	private JiraIssueRequestDto(String issueKey,String summary, String description, String assignee,
		String epicType, String issueType, int storyPoint) {
		this.issueKey = issueKey;
		this.summary = summary;
		this.description = description;
		this.assignee = assignee;
		this.issueType = issueType;
		this.storyPoint = storyPoint;
		this.epicKey = epicType;
	}

}

