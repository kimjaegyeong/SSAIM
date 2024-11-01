package com.e203.weeklyremind.repository;

import com.e203.weeklyremind.entity.WeeklyRemind;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeeklyRemindRepository extends JpaRepository<WeeklyRemind, Integer> {

}
