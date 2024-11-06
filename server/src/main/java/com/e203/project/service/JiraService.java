package com.e203.project.service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.e203.project.dto.request.JiraIssueResponseDto;
import com.e203.project.dto.request.ProjectJiraConnectDto;
import com.e203.project.dto.jiraapi.JiraResponse;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JiraService {
	private static final Logger log = LoggerFactory.getLogger(JiraService.class);
	// jira api key를 db에 저장하기
	private final ProjectRepository projectRepository;
	private final ProjectMemberRepository projectMemberRepository;
	private final RestClient restClient;
	private final ObjectMapper objectMapper;
	private final String JIRA_URL = "https://ssafy.atlassian.net/rest/api/3/search";

	@Transactional
	public Boolean setJiraApi(ProjectJiraConnectDto jiraConnectDto, int projectId) {
		Project project = projectRepository.findById(projectId).orElse(null);
		if (project == null) {
			return false;
		}
		project.setJiraApi(jiraConnectDto.getJiraApi());
		project.setJiraProjectId(jiraConnectDto.getJiraProjectId());

		return true;
	}

	@Transactional
	public List<JiraIssueResponseDto> findAllJiraIssues(String startDate, String endDate, int projectId) {
		JiraResponse jiraIssues = getJiraIssues(startDate, endDate, projectId);
		if(jiraIssues ==null){
			return null;
		}
		return jiraIssues.getIssues() == null ? null : jiraIssues.getIssues().stream()
			.map(JiraIssueResponseDto::transferDto)
			.collect(Collectors.toList());
	}

	@Transactional
	public JiraResponse getJiraIssues(String startDate, String endDate, int projectId) {
		ProjectMember leader = getProjectLeader(projectId);
		if(leader==null){
			return null;
		}
		String jiraApi = leader.getProject().getJiraApi();
		String jiraProjectId = leader.getProject().getJiraProjectId();
		String userEmail = leader.getUser().getUserEmail();

		String jql = "project=\"" + jiraProjectId + "\" + AND created >= \"" + startDate + "\" AND created <= \"" + endDate + "\"";
		String fields = "summary,status,assignee,customfield_10014,customfield_10031";
		String url = JIRA_URL + "?jql=" + jql + "&fields=" + fields;

		String encodedCredentials = Base64.getEncoder().encodeToString((userEmail + ":" + jiraApi).getBytes());

		try {
			String responseBody = restClient.get()
				.uri(url)
				.header("Authorization", "Basic " + encodedCredentials)
				.header("Content-Type", "application/json")
				.retrieve()
				.body(String.class);
			return objectMapper.readValue(responseBody, JiraResponse.class);
		} catch (RestClientException e) {
			handleException("Error occurred while calling Jira API", e);
		} catch (JsonProcessingException e) {
			handleException("Error processing JSON response", e);
		} catch (IllegalArgumentException e) {
			handleException("Invalid argument", e);
		} catch (Exception e) {
			handleException("An unexpected error occurred", e);
		}

		return null;
	}

	private ProjectMember getProjectLeader(int projectId) {
		List<ProjectMember> leader = projectMemberRepository.findByProjectIdAndRole(projectId, 1);
		if (leader.size() != 1) {
			return null;
		}
		return leader.get(0);
	}

	private void handleException(String message, Exception e) {
		log.error(message,e);
	}
}