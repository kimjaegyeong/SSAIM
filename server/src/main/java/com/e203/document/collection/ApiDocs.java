package com.e203.document.collection;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Document(collection = "ApiDocs")
public class ApiDocs {
	private int projectId;
	@Setter
	private String content;
	private LocalDateTime createdAt; // 생성 시간 필드 추가

	@Builder
	private ApiDocs(int projectId, String content, LocalDateTime createdAt)
	{
		this.projectId = projectId;
		this.content = content;
		this.createdAt = LocalDateTime.now();
	}
}
