package com.e203.project.service;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import com.e203.project.dto.request.JiraIssueResponseDto;
import com.e203.project.dto.request.ProjectJiraConnectDto;
import com.e203.project.dto.jiraapi.JiraResponse;
import com.e203.project.dto.response.ProjectJiraEpicDto;
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
	@DisplayName("Project Jira issue 조회")
	public void findJiraIssue(){
		//날짜 data는 항상 yyyy-mm-dd 형식이어야 함
		JiraResponse jiraIssues=jiraService.getJiraIssues("2024-10-21", "2024-10-25", 1);
		System.out.println(jiraIssues.toString());
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
		List<ProjectJiraEpicDto> list = jiraService.getEpics(1);
		list.stream().forEach(System.out::println);
	}
}
