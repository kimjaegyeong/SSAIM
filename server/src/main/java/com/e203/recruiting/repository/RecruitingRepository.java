package com.e203.recruiting.repository;

import com.e203.recruiting.entity.BoardRecruiting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruitingRepository extends JpaRepository<BoardRecruiting, Integer> {

    BoardRecruiting findByRecruitingId(int recruitingId);
}
