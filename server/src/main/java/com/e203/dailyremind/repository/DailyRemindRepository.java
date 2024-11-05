package com.e203.dailyremind.repository;

import com.e203.dailyremind.entity.DailyRemind;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyRemindRepository extends JpaRepository<DailyRemind, Integer> {
}
