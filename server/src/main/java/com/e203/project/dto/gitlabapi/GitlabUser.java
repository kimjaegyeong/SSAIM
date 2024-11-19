package com.e203.project.dto.gitlabapi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class GitlabUser {
	private int id;
	private String username;
	private String name;
	private String state;
	@JsonProperty("web_url")
	private String webUrl;

}
