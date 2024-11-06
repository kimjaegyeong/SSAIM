package com.e203.document.controller;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.e203.document.collection.Proposal;
import com.e203.document.service.ProposalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProposalController {
	private final ProposalService proposalService;

	@PostMapping("/api/v1/projects/{projectId}/proposal")
	public ResponseEntity<String> createProposal(@PathVariable String projectId) {
		Proposal result = proposalService.saveProposal(projectId);
		if(result ==null){
			return ResponseEntity.status(NOT_FOUND).body("기획서 생성 실패");
		}
		return ResponseEntity.status(OK).body("기획서 생성 성공"); // 201 Created 응답
	}

	@GetMapping("/api/v1/projects/{projectId}/proposal")
	public ResponseEntity<String> findProposalContent(@PathVariable String projectId) {
		String proposalContent = proposalService.getProposalContent(projectId);

		if(proposalContent==null){
			return ResponseEntity.status(NOT_FOUND).body("기획서 조회 실패");
		}
		return ResponseEntity.status(OK).body(proposalContent);
	}
}
