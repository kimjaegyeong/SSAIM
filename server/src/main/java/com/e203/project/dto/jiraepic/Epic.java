package com.e203.project.dto.jiraepic;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Epic {
	private String expand;
	private int startAt;
	private int maxResults;
	private int total;
	private List<EpicIssue> issues;
}
