package com.e203.project.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectMemberFindResponseDto {
	private int pmId;
	private int userId;
	private String name;
	private int role;
	private String profileImage;
	@Builder
	public ProjectMemberFindResponseDto(int pmId, int userId,String name, int role, String profileImage) {
		this.pmId = pmId;
		this.userId = userId;
		this.name = name;
		this.role = role;
		this.profileImage = profileImage;
	}
}
