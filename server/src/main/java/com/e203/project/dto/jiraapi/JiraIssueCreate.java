package com.e203.project.dto.jiraapi;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.e203.project.dto.request.JiraIssueCreateRequestDto;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JiraIssueCreate {
	private Map<String, String> project;
	private String summary;
	private IssueDescription description;
	@JsonProperty("issuetype")
	private Map<String, String> issueType;
	private Map<String, String> assignee;
	@JsonProperty("customfield_10014")
	private String epicKey; // 에픽
	@JsonProperty("customfield_10031")
	private int storyPoint; // 스토리 포인트

}
