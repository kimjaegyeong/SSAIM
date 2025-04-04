package com.e203.project.service;

import com.e203.document.dto.response.ApiDocsResponseDto;
import com.e203.document.service.ApiDocsService;
import com.e203.document.service.FunctionDescriptionService;
import com.e203.document.service.ProposalService;
import com.e203.global.utils.FileUploader;
import com.e203.project.dto.request.ProjectCreateRequestDto;
import com.e203.project.dto.request.ProjectEditRequestDto;
import com.e203.project.dto.request.ProjectMemberCreateRequestDto;
import com.e203.project.dto.request.ProjectMemberEditRequestDto;
import com.e203.project.dto.response.ProjectFindResponseDto;
import com.e203.project.dto.response.ProjectMemberFindResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    private final ProjectMemberService projectMemberService;

    private final ApiDocsService apiDocsService;

    private final FunctionDescriptionService functionDescriptionService;

    private final ProposalService proposalService;

    private final UserRepository userRepository;

    private final ProjectMemberRepository projectMemberRepository;

    private final FileUploader fileUploader;

    @Transactional
    public boolean createProject(MultipartFile image, ProjectCreateRequestDto projectCreateRequestDto) {

        Project entity = projectCreateRequestDto.toEntity();

        if (image != null) {
            String imageUrl = fileUploader.upload(image);
            entity.setProfileImage(imageUrl);
        }

        Project project = projectRepository.save(entity);

        projectCreateRequestDto.getTeamMembers().stream()
                .map(member -> createProjectMember(project, member))
                .forEach(projectMemberService::save);

        apiDocsService.saveApiDocs(project.getId());
        functionDescriptionService.saveFuncDesc(project.getId());
        proposalService.saveProposal(project.getId());

        //if project, projectMember가 잘 저장되었다면
        return true;
    }

    @Transactional
    public List<ProjectFindResponseDto> findAllProjects(int userId) {
        return findAll(userId).stream()
                .map(this::getProjectFindResponseDto)
                .toList();
    }

    @Transactional
    public ProjectFindResponseDto findProjectInfo(Integer projectId, int userId) {
        Project project = findEntity(projectId);
        if (project == null) {
            return null;
        } else if (project.getProjectMembers().stream().noneMatch(member -> member.getUser().getUserId() == userId)) {
            return ProjectFindResponseDto.builder()
                    .id(-1)
                    .build();
        }
        return getProjectFindResponseDto(project);
    }

    public Project findEntity(Integer projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        return project.orElse(null);
    }

    public List<Project> findAll(int userId) {
        return projectMemberRepository.findProjectsByUserId(userId);
    }

    private ProjectFindResponseDto getProjectFindResponseDto(Project project) {
        ApiDocsResponseDto dto = apiDocsService.parseStringToObject(project.getId());
        return ProjectFindResponseDto.fromEntity(project, dto == null ? 0 : getProgress(dto.getFrontState()),
                dto == null ? 0 : getProgress(dto.getBackState()), createProjectMemberFindResponseDtos(project));
    }

    private List<ProjectMemberFindResponseDto> createProjectMemberFindResponseDtos(Project project) {
        return project.getProjectMembers().stream()
                .map(ProjectMemberFindResponseDto::fromEntity)
                .toList();
    }

    private ProjectMember createProjectMember(Project project, ProjectMemberCreateRequestDto member) {
        User user = userRepository.findById(member.getId()).orElse(null);
        return ProjectMember.builder()
                .user(user)
                .project(project)
                .role(member.getRole())
                .build();
    }


    public int getProgress(List<Integer> states) {
        return states.isEmpty() ? 0 : 100 * Collections.frequency(states, 2) / states.size();
    }

    @Transactional
    public String editProjectInfo(Integer projectId, ProjectEditRequestDto dto, MultipartFile image, int userId) {

        Project project = findEntity(projectId);

        if (project == null) {
            return "Not found";
        } else if (project.getProjectMembers().stream().noneMatch(
                member -> member.getUser().getUserId() == userId && member.getRole() == 1)) {
            return "Not authorized";
        }

        if (image != null) {
            String imageUrl = fileUploader.upload(image);
            project.setProfileImage(imageUrl);
        }

        if (dto != null) {
            updateProjectFields(project, dto);
            updateProjectMembers(project, dto.getProjectMembers());
        }

        return "Updated";
    }

    private void updateProjectMembers(Project project, List<ProjectMemberEditRequestDto> projectMembers) {
        projectMembers.stream()
                .filter(ProjectMemberEditRequestDto::isUpdate)
                .forEach(member -> {
                    if (member.getUserId() != null) {
                        project.getProjectMembers().add(
                                ProjectMemberEditRequestDto.toEntity(project, new User(member.getUserId()), member));
                    } else {
                        Optional<ProjectMember> projectMember = projectMemberRepository.findById(member.getProjectMemberId());
                        if (member.isDelete()) {
                            projectMember.ifPresent(projectMemberRepository::delete);
                        } else if (member.getRole() != null) {
                            projectMember.ifPresent(pm -> pm.setRole(member.getRole()));
                        }
                    }
                });
    }

    private void updateProjectFields(Project project, ProjectEditRequestDto dto) {
        updateFieldIfPresent(dto.getTitle(), project::setTitle);
        updateFieldIfPresent(dto.getName(), project::setName);
        updateFieldIfPresent(dto.getStartDate(), project::setStartDate);
        updateFieldIfPresent(dto.getEndDate(), project::setEndDate);
        updateFieldIfPresent(dto.getGitlabUrl(), project::setGitlabUrl);
        updateFieldIfPresent(dto.getJiraUrl(), project::setJiraUrl);
        updateFieldIfPresent(dto.getFigmaUrl(), project::setFigmaUrl);
        updateFieldIfPresent(dto.getNotionUrl(), project::setNotionUrl);
    }


    private <T> void updateFieldIfPresent(T value, Consumer<T> setter) {
        Optional.ofNullable(value).ifPresent(setter);
    }

    public String removeProject(int userId, Integer projectId) {

        Project project = findEntity(projectId);

        if (project == null) {
            return "Not found";
        }

        if (project.getProjectMembers().stream().noneMatch(
                member -> member.getUser().getUserId() == userId && member.getRole() == 1)) {
            return "Not authorized";
        }

        projectRepository.delete(project);

        return "Deleted";
    }
}

