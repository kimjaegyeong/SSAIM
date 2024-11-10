package com.e203.project.service;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import com.e203.project.dto.request.JiraIssueRequestDto;
import com.e203.project.dto.response.JiraIssueResponseDto;
import com.e203.project.dto.request.ProjectJiraConnectDto;
import com.e203.project.dto.response.ProjectJiraEpicResponseDto;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;

@SpringBootTest
@TestPropertySource(properties = "jasypt.encryptor.password=wonderwise123")
public class JiraServiceTest {
	@Autowired JiraService jiraService;
	@Autowired
	private ProjectRepository projectRepository;
	@Autowired
	private ProjectMemberRepository projectMemberRepository;
	@Autowired
	private ProjectMemberService projectMemberService;

	@Test
	@DisplayName("JiraApi 연결을 성공적으로 수행하는 테스트")
	public void updateJiraApiTest(){
		//given
		int projectId = 1;
		String jiraApiKey = "jiraApiKEy12314lskdjfsdfjsairwkds";
		ProjectJiraConnectDto dto = ProjectJiraConnectDto.builder()
			.jiraApi(jiraApiKey)
			.build();

		//when
		boolean result = jiraService.setJiraApi(dto, projectId);

		//then

		Assertions.assertTrue(result);
	}

	@Test
	@DisplayName("Project Leader 조회")
	public void findLeader(){
		List<ProjectMember> leader= projectMemberRepository.findByProjectIdAndRole(1,1);
		System.out.println(leader.get(0).getUser().getUserEmail());
		System.out.println(leader.get(0).getProject().getJiraApi());
	}

	@Test
	@DisplayName("Project Jira Issue Dto 조회")
	public void findJiraIssueDto(){
		List<JiraIssueResponseDto> allJiraIssues = jiraService.findAllJiraIssues("2024-10-21", "2024-10-25", 1);
		allJiraIssues.forEach(System.out::println);
		System.out.println(allJiraIssues.size());
	}

	@Test
	@DisplayName("Project Epic 조회")
	public void findEpics(){
		List<ProjectJiraEpicResponseDto> list = jiraService.findAllEpics(1);
		list.stream().forEach(System.out::println);
	}

	@Test
	@DisplayName("Project Issue 등록")
	public void findIssue(){
		JiraIssueRequestDto build = JiraIssueRequestDto.builder()
			.issueType("Story")
			.summary("api test")
			.description("description test")
			.epicType("S11P31E203-310")
			.storyPoint(3)
			.assignee("김재경")
			.build();

		ResponseEntity<Map> issue = jiraService.createIssue(1, build);
		System.out.println(issue);
	}
}
