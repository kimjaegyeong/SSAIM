package com.e203.project.dto.jiraapi;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IssueContent {
	private String type;
	private List<Map<String, String>> content = new ArrayList<>(); // content를 Map으로 변경

	@Builder
	public IssueContent(String type, List<Map<String, String>> content) {
		this.type  ="paragraph";
		this.content =content;
	}
}
