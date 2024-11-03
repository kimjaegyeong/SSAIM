package com.e203.user.repository;

import com.e203.user.entity.User;
import com.e203.user.response.UserInfoResponseDto;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Boolean existsByUserEmail(String userEmail);

    User findByUserEmail(String userEmail);

    User findByUserId(int userId);

    List<User> findAll(Specification<User> spec);
}
