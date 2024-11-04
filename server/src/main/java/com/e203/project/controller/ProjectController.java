package com.e203.project.controller;

import static org.springframework.http.HttpStatus.*;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.e203.project.dto.request.ProjectCreateRequestDto;
import com.e203.project.dto.response.ProjectFindResponseDto;
import com.e203.project.service.ProjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProjectController {
	private final ProjectService projectService;

	@PostMapping("/api/v1/projects")
	public ResponseEntity<String> createProject(@RequestBody ProjectCreateRequestDto requestDto) {
		boolean result = projectService.createProject(requestDto);

		if(result){
			return ResponseEntity.status(OK).body("success");
		}else{
			return ResponseEntity.status(INTERNAL_SERVER_ERROR).body("project create error");
		}
	}

	@GetMapping("/api/v1/projects/{projectId}")
	public ResponseEntity<ProjectFindResponseDto> findProjectInfo(@PathVariable Integer projectId) {
		ProjectFindResponseDto projectInfo = projectService.findProjectInfo(projectId);
			return ResponseEntity.status(OK).body(projectInfo);
	}

	@GetMapping("/api/v1/user/{userId}/projects")
	public ResponseEntity<List<ProjectFindResponseDto>> findAllProjects(@PathVariable Integer userId) {
		List<ProjectFindResponseDto> projectFindResponseDtos = projectService.findAllProjects(userId);
		return ResponseEntity.status(OK).body(projectFindResponseDtos);
	}
}
