package com.e203.project.dto.request;

import com.e203.project.dto.jiraapi.JiraIssueCreate;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JiraIssueCreateRequestDto {
	private String summary;
	private String description;
	private String assignee;
	private String issueType;
	private String epicKey;
	private int storyPoint;

	@Builder
	private JiraIssueCreateRequestDto(String summary, String description, String assignee,
		String epicType, String issueType, int storyPoint) {
		this.summary = summary;
		this.description = description;
		this.assignee = assignee;
		this.issueType = issueType;
		this.storyPoint = storyPoint;
		this.epicKey = epicType;
	}

}

