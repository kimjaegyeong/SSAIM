package com.e203.project.dto.request;

import java.time.LocalDateTime;
import java.util.ArrayList;

import com.e203.project.entity.Project;

import lombok.Builder;
import lombok.Getter;

@Getter
public class ProjectCreateRequestDto {
	private String title;
	private String name;
	private String profileImage;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
	private ArrayList<ProjectCreateMemberRequestDto> teamMembers ;

	@Builder
	private ProjectCreateRequestDto(String title, String name, String profileImage, LocalDateTime startDate, LocalDateTime endDate, ArrayList<ProjectCreateMemberRequestDto> teamMembers) {
		this.title = title;
		this.name = name;
		this.profileImage = profileImage;
		this.startDate = startDate;
		this.endDate = endDate;
		this.teamMembers = teamMembers;
	}

	public Project toEntity(){
		return Project.builder()
			.title(this.title)
			.name(this.name)
			.progressFront(this.profileImage)
			.startDate(this.startDate)
			.endDate(this.endDate)
			.build();
	}

}
