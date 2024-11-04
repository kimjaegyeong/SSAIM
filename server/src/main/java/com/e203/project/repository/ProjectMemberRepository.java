package com.e203.project.repository;

import com.e203.project.entity.ProjectMember;
import com.e203.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Integer> {

    ProjectMember findByUser(User user);
}
