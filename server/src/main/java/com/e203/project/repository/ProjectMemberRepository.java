package com.e203.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.e203.project.entity.ProjectMember;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
}
