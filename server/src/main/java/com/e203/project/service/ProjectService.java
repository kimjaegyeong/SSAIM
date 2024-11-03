package com.e203.project.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e203.project.dto.request.ProjectMemberCreateRequestDto;
import com.e203.project.dto.request.ProjectCreateRequestDto;

import com.e203.project.dto.response.ProjectFindResponseDto;
import com.e203.project.dto.response.ProjectMemberFindResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectRepository;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {
	private final ProjectRepository projectRepository;
	private final ProjectMemberService projectMemberService;
	private final UserRepository userRepository;

	@Transactional
	public boolean createProject(ProjectCreateRequestDto projectCreateRequestDto) {

		Project entity = projectCreateRequestDto.toEntity();
		Project project = projectRepository.save(entity);

		//ProjectMember 생성
		for(int i=0; i<projectCreateRequestDto.getTeamMembers().size(); i++){
			ProjectMember projectMember = createProjectMember(project, projectCreateRequestDto.getTeamMembers().get(i));
			projectMemberService.save(projectMember);
		}
		//if project, projectMember가 잘 저장되었다면
		return true;
	}

	public Project findEntity(Integer projectId) {
		Optional<Project> project = projectRepository.findById(projectId);
		return project.orElse(null);
	}

	public ProjectFindResponseDto findProjectInfo(Integer projectId) {
		Project project = findEntity(projectId);
		List<ProjectMemberFindResponseDto> projectMemberFindResponseDtoList;
		List<ProjectMember> projectMembers = projectMemberService.findEntityList(projectId);

		//projectMembers를 dto로 바꾸기
		projectMemberFindResponseDtoList = createProjectMemberFindResponseDtos(projectMembers);

		//projectMember + project
		ProjectFindResponseDto projectFindResponseDto = ProjectFindResponseDto.builder()
			.id(project.getId())
			.name(project.getName())
			.startDate(project.getStartDate())
			.endDate(project.getEndDate())
			.jiraApi(project.getJiraApi())               // 프로젝트의 Jira API 정보
			.gitlabApi(project.getGitlabApi())           // 프로젝트의 GitLab API 정보
			.progress_back(project.getProgressBack())    // 백엔드 진행도
			.progress_front(project.getProgressFront())  // 프론트엔드 진행도
			.build();

		return projectFindResponseDto;
	}

	private List<ProjectMemberFindResponseDto> createProjectMemberFindResponseDtos(List<ProjectMember> projectMembers) {
		List<ProjectMemberFindResponseDto> projectMemberFindResponseDtoList = new ArrayList<>();

		for (ProjectMember projectMember : projectMembers) {
			ProjectMemberFindResponseDto dto = ProjectMemberFindResponseDto.builder()
				.id(projectMember.getId())
				.name(projectMember.getUser().getUserName())
				.role(projectMember.getRole())
				.profileImage(projectMember.getUser().getUserProfileImage())
				.build();
			projectMemberFindResponseDtoList.add(dto);
		}
		return projectMemberFindResponseDtoList;
	}

	private ProjectMember createProjectMember(Project project, ProjectMemberCreateRequestDto member) {
 		User user = userRepository.findById(member.getId()).orElse(null);
		return ProjectMember.builder()
				.user(user)
				.project(project)
				.role(member.getRole())
				.build();
	}


}

