package com.e203.project.service;

import java.util.Date;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e203.project.dto.request.ProjectCreateMemberRequestDto;
import com.e203.project.dto.request.ProjectCreateRequestDto;

import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.e203.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {
	private final ProjectRepository projectRepository;
	private final ProjectMemberRepository projectMemberRepository;
	@Transactional
	public boolean create(ProjectCreateRequestDto projectCreateRequestDto) {
		Project entity = projectCreateRequestDto.toEntity();
		Project project = projectRepository.save(entity);
		//ProjectMember 생성
		for(int i=0; i<projectCreateRequestDto.getTeamMembers().size(); i++){
			ProjectMember projectMember = createProjectMember(project, projectCreateRequestDto.getTeamMembers().get(i));
			projectMemberRepository.save(projectMember);
		}
		//if project, projectMember가 잘 저장되었다면
		return true;
	}

	private ProjectMember createProjectMember(Project project, ProjectCreateMemberRequestDto member) {
		User user = userTestStub(member);
		return ProjectMember.builder()
				.user(user)
				.project(project)
				.role(member.getRole())
				.build();
	}

	private User userTestStub(ProjectCreateMemberRequestDto member){
		return new User(member.getId(),"test@test.com","test1",1,1,"23423324sjkfssadg","Test","testest1","String,Boot",0,
			new Date(),1,"010-1111-1111","linkddd");
	}
}

