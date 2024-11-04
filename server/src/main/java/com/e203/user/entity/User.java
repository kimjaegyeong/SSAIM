package com.e203.user.entity;


import com.e203.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "user")
public class User extends BaseEntity {
    @Id
    @Column(name = "user_id")
    @Setter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(name = "user_email", nullable = false, unique = true)
    private String userEmail;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "user_class")
    private int userClass;

    @Column(name = "user_campus")
    private int userCampus;

    @Column(name = "user_generation")
    private int userGeneration;

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
    private LocalDate userBirth;

    @Column(name = "user_gender")
    private int userGender;

    @Column(name = "user_phone", length = 20)
    private String userPhone;

    @Column(name = "user_profile_image")
    private String userProfileImage;

    @Builder
    public User(String userEmail, String userName, int userClass, int userCampus, int userGeneration, String userPw, String userNickname, String userProfileMessage, String userSkills, int userRole, LocalDate userBirth, int userGender, String userPhone, String userProfileImage) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.userClass = userClass;
        this.userCampus = userCampus;
        this.userGeneration = userGeneration;
        this.userPw = userPw;
        this.userNickname = userNickname;
        this.userProfileMessage = userProfileMessage;
        this.userSkills = userSkills;
        this.userRole = userRole;
        this.userBirth = userBirth;
        this.userGender = userGender;
        this.userPhone = userPhone;
        this.userProfileImage = userProfileImage;
    }
}
