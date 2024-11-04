package com.e203.project.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectMemberFindResponseDto {
	private int id;
	private String name;
	private int role;
	private String profileImage;
	@Builder
	public ProjectMemberFindResponseDto(int id, String name, int role, String profileImage) {
		this.id = id;
		this.name = name;
		this.role = role;
		this.profileImage = profileImage;
	}
}
