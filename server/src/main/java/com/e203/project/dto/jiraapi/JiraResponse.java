package com.e203.project.dto.jiraapi;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class JiraResponse {
	private int maxResults;
	private int total;
	private List<JiraIssue> issues;
}