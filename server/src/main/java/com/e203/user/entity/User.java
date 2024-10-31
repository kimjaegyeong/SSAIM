package com.e203.user.entity;


import com.e203.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "user")
public class User extends BaseEntity {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(name = "user_email", nullable = false, unique = true)
    private String userEmail;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_class")
    private Integer userClass;

    @Column(name = "user_campus")
    private Integer userCampus;

    @Column(name = "user_pw", nullable = false)
    private String userPw;

    @Column(name = "user_nickname", nullable = false)
    private String userNickname;

    @Column(name = "user_profile_message")
    private String userProfileMessage;

    @Column(name = "user_skills")
    private String userSkills;

    @Column(name = "user_role", nullable = false, columnDefinition = "int default 0")
    private int userRole;

    @Column(name = "user_birth")
    private Date userBirth;

    @Column(name = "user_gender")
    private Integer userGender;

    @Column(name = "user_phone", length = 20)
    private String userPhone;

    @Column(name = "user_profile_image")
    private String userProfileImage;

}
