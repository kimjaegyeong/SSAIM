package com.e203.document.controller;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.e203.document.collection.FunctionDescription;
import com.e203.document.service.FunctionDescriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FunctionDescriptionController {
	private final FunctionDescriptionService functionDescriptionService;

	@PostMapping("/api/v1/projects/{projectId}/function-description")
	public ResponseEntity<String> createFuncDesc(@PathVariable String projectId) {
		FunctionDescription funcDesc = functionDescriptionService.saveFuncDesc(projectId);
		if(funcDesc == null){
			return ResponseEntity.status(NOT_FOUND).body("기능명세서 생성 실패");
		}
		return ResponseEntity.status(OK).body("기능명세서 생성 성공"); // 201 Created 응답
	}

	@GetMapping("/api/v1/projects/{projectId}/function-description")
	public ResponseEntity<String> findFuncDescContent(@PathVariable String projectId) {
		String funcDescContent = functionDescriptionService.getFuncDescContent(projectId);
		if(funcDescContent==null){
			return ResponseEntity.status(NOT_FOUND).body("기능명세서 조회 실패");
		}
		return ResponseEntity.status(OK).body(funcDescContent);
	}
}
