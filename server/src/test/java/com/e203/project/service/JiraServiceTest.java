package com.e203.project.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import com.e203.project.dto.request.ProjectJiraConnectDto;
import com.e203.project.repository.ProjectRepository;

@SpringBootTest
@TestPropertySource(properties = "jasypt.encryptor.password=wonderwise123")
public class JiraServiceTest {
	@Autowired JiraService jiraService;
	@Autowired
	private ProjectRepository projectRepository;

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
		String result = jiraService.setJiraApi(dto, projectId);

		//then

		Assertions.assertEquals(result,jiraApiKey);
	}
}
