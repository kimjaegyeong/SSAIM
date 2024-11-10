package com.e203.project.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import com.e203.project.dto.jiraapi.JiraContent;
import com.e203.project.dto.jiraapi.JiraIssueFields;
import com.e203.project.dto.request.JiraIssueCreateRequestDto;
import com.e203.project.dto.request.JiraIssueResponseDto;
import com.e203.project.dto.request.ProjectJiraConnectDto;
import com.e203.project.dto.jiraapi.JiraResponse;
import com.e203.project.dto.response.ProjectJiraEpicResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
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

	public List<JiraIssueResponseDto> findAllJiraIssues(String startDate, String endDate, int projectId) {
		ProjectMember leader = getProjectLeader(projectId);
		if (leader == null) {
			return null;
		}
		String jiraApi = leader.getProject().getJiraApi();
		String jiraProjectId = leader.getProject().getJiraProjectId();
		String userEmail = leader.getUser().getUserEmail();
		String encodedCredentials = Base64.getEncoder().encodeToString((userEmail + ":" + jiraApi).getBytes());

		String jql = "project=\"" + jiraProjectId + "\" AND created >= \"" + startDate + "\" AND created <= \"" + endDate + "\"";
		String fields = "summary,status,assignee,customfield_10014,customfield_10031";

		List<JiraContent> issues = retrieve(jql, fields, encodedCredentials);
		return issues.stream().map(JiraIssueResponseDto::transferDto).collect(Collectors.toList());
	}

	public List<ProjectJiraEpicResponseDto> findAllEpics(int projectId) {
		ProjectMember leader = getProjectLeader(projectId);
		if (leader == null) {
			return null;
		}
		String jiraApi = leader.getProject().getJiraApi();
		String jiraProjectId = leader.getProject().getJiraProjectId();
		String userEmail = leader.getUser().getUserEmail();
		String encodedCredentials = Base64.getEncoder().encodeToString((userEmail + ":" + jiraApi).getBytes());

		String jql = "project=\"" + jiraProjectId + "\" AND issuetype=Epic";
		String fields = "key,summary";

		List<JiraContent> epics = retrieve(jql, fields, encodedCredentials);
		return epics.stream().map(ProjectJiraEpicResponseDto::transferDto).collect(Collectors.toList());
	}

	public ResponseEntity<Map> createIssue(int projectId, JiraIssueCreateRequestDto dto) {
		ProjectMember leader = getProjectLeader(projectId);
		if (leader == null) {
			return null;
		}
		String jiraUrl = "https://ssafy.atlassian.net/rest/api/3/issue";
		String jiraApi = leader.getProject().getJiraApi();
		String jiraProjectId = leader.getProject().getJiraProjectId();
		String userEmail = leader.getUser().getUserEmail();
		String encodedCredentials = Base64.getEncoder().encodeToString((userEmail + ":" + jiraApi).getBytes());

		JiraIssueFields jiraIssueFields = JiraIssueFields.transferJsonObject(dto, jiraProjectId);

		ResponseEntity<Map> response = restClient.post()
			.uri(jiraUrl)
			.contentType(MediaType.APPLICATION_JSON)
			.header("Authorization", "Basic " + encodedCredentials)
			.body(jiraIssueFields)
			.retrieve()
			.toEntity(Map.class);

		return response;
	}


	private List<JiraContent> retrieve(String jql, String fields, String encodedCredentials) {
		List<JiraContent> issues = new ArrayList<>();
		int startAt = 0;
		int maxResults = 100;
		boolean hasMore = true;

		while (hasMore) {
			String url = JIRA_URL + "?jql=" + jql + "&fields=" + fields + "&startAt=" + startAt + "&maxResults=" + maxResults;
			try {
				String responseBody = getRequestString(url, encodedCredentials);
				JiraResponse response = objectMapper.readValue(responseBody, JiraResponse.class);
				issues.addAll(response.getIssues());
				startAt += response.getIssues().size();
				hasMore = startAt < response.getTotal();
			} catch (Exception e) {
				handleException("Error occurred while calling Jira API", e);
				break;
			}
		}
		return issues;
	}

	private String getRequestString(String url, String encodedCredentials) {
		return restClient.get()
			.uri(url)
			.header("Authorization", "Basic " + encodedCredentials)
			.header("Content-Type", "application/json")
			.retrieve()
			.body(String.class);
	}

	private ProjectMember getProjectLeader(int projectId) {
		List<ProjectMember> leader = projectMemberRepository.findByProjectIdAndRole(projectId, 1);
		if (leader.size() != 1) {
			return null;
		}
		return leader.get(0);
	}

	private void handleException(String message, Exception e) {
		log.error(message, e);
	}
}