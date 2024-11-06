package com.e203.document.controller;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.e203.document.collection.ApiDocs;
import com.e203.document.service.ApiDocsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ApiDocsController {
	private final ApiDocsService apiDocsService;

	@PostMapping("/api/v1/projects/{projectId}/api-docs")
	public ResponseEntity<String> createApiDocs(@PathVariable("projectId") String projectId) {
		ApiDocs result = apiDocsService.saveApiDocs(projectId);
		if(result==null){
			return ResponseEntity.status(NOT_FOUND).body("API명세서 문서 생성 실패.");
		}
		return ResponseEntity.status(OK).body("API명세서 문서 생성 완료.");
	}

	@GetMapping("/api/v1/projects/{projectId}/api-docs")
	public ResponseEntity<String> findApiDocsContent(@PathVariable("projectId") String projectId){
		String apiDocsContent = apiDocsService.getApiDocsContent(projectId);
		if(apiDocsContent==null){
			ResponseEntity.status(NOT_FOUND).body(" API 명세 조회 실패");
		}
		return  ResponseEntity.status(OK).body(apiDocsContent);
	}
}
