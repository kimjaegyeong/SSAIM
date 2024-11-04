package com.e203.dailyremind.repository;

import com.e203.dailyremind.entity.DailyRemind;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DailyRemindRepository extends JpaRepository<DailyRemind, Integer> {

    List<DailyRemind> findByProjectIdAndDailyRemindAuthor(Project project, ProjectMember author);
    List<DailyRemind> findByProjectId(Project project);
}
