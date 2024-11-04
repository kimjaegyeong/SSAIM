package com.e203.project.service;

import org.springframework.stereotype.Service;

import com.e203.project.dto.request.ProjectGitlabConnectDto;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GitlabService {
	private final ProjectRepository projectRepository;

	public boolean setGitlabApi(ProjectGitlabConnectDto gitlabDto ,int projectId){
		Project project = projectRepository.findById(projectId).orElse(null);
		if(project==null){
			return false;
		}
		project.setJiraApi(gitlabDto.getGitlabApi());
		return true;
	}
}
