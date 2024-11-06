package com.e203.project.dto.jiraapi;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class JiraIssue {
	private String id;
	private String self;
	private String key;
	private JiraFields fields;

}