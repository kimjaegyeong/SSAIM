package com.e203.weeklyremind.repository;

import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.weeklyremind.entity.WeeklyRemind;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WeeklyRemindRepository extends JpaRepository<WeeklyRemind, Integer> {

    List<WeeklyRemind> findWeeklyRemindByWeeklyRemindAuthor(ProjectMember author);

    @Query("SELECT w FROM WeeklyRemind w WHERE "
            + "(:projectId IS NULL OR w.projectId.id = :projectId) AND "
            + "((:startDate IS NULL AND :endDate IS NULL) OR w.weeklyRemindDate BETWEEN :startDate AND :endDate) AND "
            + "(:projectMemberId IS NULL OR w.weeklyRemindAuthor.id = :projectMemberId)")
    List<WeeklyRemind> findWeeklyReminds(
            @Param("projectId") Integer projectId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("projectMemberId") Integer projectMemberId
    );
}
