package com.e203.project.controller;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.e203.project.dto.request.ProjectGitlabConnectDto;
import com.e203.project.service.GitlabService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class GitlabController {

	private final GitlabService gitlabService;
	@PostMapping("api/v1/projects/{projectId}/gitlab-api")
	public ResponseEntity<String> connectGitlabApi(@PathVariable("projectId") int projectId, @RequestBody
		ProjectGitlabConnectDto projectGitlabConnectDto) {
		boolean result = gitlabService.setGitlabApi(projectGitlabConnectDto, projectId);

		if(result){
			return ResponseEntity.status(OK).body("gitlab key 등록에 성공했습니다.");
		}else{
			return ResponseEntity.status(NOT_FOUND).body("gitlab key 등록에 실패했습니다.");
		}
	}

}
