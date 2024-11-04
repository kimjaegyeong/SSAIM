package com.e203.project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e203.project.dto.request.ProjectJiraConnectDto;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JiraService {
	// jira api key를 db에 저장하기
	private final ProjectRepository projectRepository;
	@Transactional
	public Boolean setJiraApi(ProjectJiraConnectDto jiraApi, int projectId){
		Project project = projectRepository.findById(projectId).orElse(null);
		if(project==null){
			return false;
		}
		project.setJiraApi(jiraApi.getJiraApi());
		return true ;
	}
}
