package com.e203.project.controller;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.e203.project.dto.request.ProjectJiraConnectDto;
import com.e203.project.service.JiraService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class JiraController {

	private final JiraService jiraService;

	@PostMapping("/api/v1/projects/{projectId}/jira-api")
	public ResponseEntity<String> connectJiraApi(@PathVariable("projectId") int projectId , @RequestBody
		ProjectJiraConnectDto projectJiraConnectDto) {

		boolean result = jiraService.setJiraApi(projectJiraConnectDto, projectId);

		if(result){
			return ResponseEntity.status(OK).body("jira api 연결 성공");
		}
		return ResponseEntity.status(BAD_REQUEST).body("jira api 연결 실패");
	}
}
