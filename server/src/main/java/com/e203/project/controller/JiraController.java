package com.e203.project.controller;

import static org.springframework.http.HttpStatus.*;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.e203.project.dto.request.JiraIssueResponseDto;
import com.e203.project.dto.request.ProjectJiraConnectDto;
import com.e203.project.dto.response.ProjectJiraEpicDto;
import com.e203.project.service.JiraService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class JiraController {

	private final JiraService jiraService;

	@PatchMapping("/api/v1/projects/{projectId}/jira-api")
	public ResponseEntity<String> connectJiraApi(@PathVariable("projectId") int projectId,
		 @RequestBody ProjectJiraConnectDto projectJiraConnectDto) {

		boolean result = jiraService.setJiraApi(projectJiraConnectDto, projectId);

		if (result) {
			return ResponseEntity.status(OK).body("jira api 연결 성공");
		}
		return ResponseEntity.status(BAD_REQUEST).body("jira api 연결 실패");
	}

	@GetMapping("/api/v1/projects/{projectId}/issue")
	public ResponseEntity<List<JiraIssueResponseDto>> findAllJiraIssue(@PathVariable("projectId") int projectId,
		@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
		List<JiraIssueResponseDto> allJiraIssues = jiraService.findAllJiraIssues(startDate, endDate, projectId);
		if(allJiraIssues==null){
			return ResponseEntity.status(NOT_FOUND).body(null);
		}
		if(allJiraIssues.isEmpty()){
			return ResponseEntity.status(OK).body(allJiraIssues);
		}
		return ResponseEntity.status(OK).body(allJiraIssues);
	}

	@GetMapping("/api/v1/projects/{projectId}/epics")
	public ResponseEntity<List<ProjectJiraEpicDto>> findAllEpic(@PathVariable("projectId") int projectId){
		List<ProjectJiraEpicDto> epics = jiraService.getEpics(projectId);
		if(epics==null){
			return ResponseEntity.status(NOT_FOUND).body(null);
		}
		return ResponseEntity.status(OK).body(epics);
	}

}
