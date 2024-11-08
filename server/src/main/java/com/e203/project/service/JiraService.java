package com.e203.project.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
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
		if (leader == null) {
			return null;
		}

		String jiraApi = leader.getProject().getJiraApi();
		String jiraProjectId = leader.getProject().getJiraProjectId();
		String userEmail = leader.getUser().getUserEmail();

		String jql = "project=\"" + jiraProjectId + "\" + AND created >= \"" + startDate + "\" AND created <= \"" + endDate + "\"";
		String fields = "summary,status,assignee,customfield_10014,customfield_10031";
		String baseUrl = JIRA_URL + "?jql=" + jql + "&fields=" + fields;

		String encodedCredentials = Base64.getEncoder().encodeToString((userEmail + ":" + jiraApi).getBytes());

		JiraResponse allIssues = new JiraResponse();
		allIssues.setIssues(new ArrayList<>()); // JiraResponse에 이슈 리스트 초기화

		int startAt = 0;
		int maxResults = 100; // 한 번에 가져올 최대 이슈 수
		boolean hasMore = true;

		while (hasMore) {
			String url = baseUrl + "&startAt=" + startAt + "&maxResults=" + maxResults;

			try {
				String responseBody = restClient.get()
					.uri(url)
					.header("Authorization", "Basic " + encodedCredentials)
					.header("Content-Type", "application/json")
					.retrieve()
					.body(String.class);

				JiraResponse response = objectMapper.readValue(responseBody, JiraResponse.class);
				allIssues.getIssues().addAll(response.getIssues()); // 가져온 이슈를 모두 추가

				startAt += response.getIssues().size();
				hasMore = startAt < response.getTotal(); // 총 이슈 수와 비교하여 더 가져올 것이 있는지 판단
			} catch (RestClientException e) {
				handleException("Error occurred while calling Jira API", e);
				break; // 예외 발생 시 루프 종료
			} catch (JsonProcessingException e) {
				handleException("Error processing JSON response", e);
				break; // 예외 발생 시 루프 종료
			} catch (IllegalArgumentException e) {
				handleException("Invalid argument", e);
				break; // 예외 발생 시 루프 종료
			} catch (Exception e) {
				handleException("An unexpected error occurred", e);
				break; // 예외 발생 시 루프 종료
			}
		}

		return allIssues; // 모든 이슈를 포함한 JiraResponse 반환
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