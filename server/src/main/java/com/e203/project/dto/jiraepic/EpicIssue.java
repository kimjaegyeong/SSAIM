package com.e203.project.dto.jiraepic;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EpicIssue {
	private String expand;
	private String id;
	private String self;
	private String key;
	@JsonProperty("fields")
	private EpicFields epicFields;
}
