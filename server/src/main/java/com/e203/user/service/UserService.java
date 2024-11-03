package com.e203.user.service;


import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import com.e203.user.request.UserLoginRequestDto;
import com.e203.user.request.UserSignUpRequestDto;
import com.e203.user.response.UserInfoResponseDto;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class UserService {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public boolean createUser(UserSignUpRequestDto userSignupRequestDto, MultipartFile profileImage) {
        if (userRepository.existsByUserEmail(userSignupRequestDto.getUserEmail())) {
            return false;
        }

        User user = User.builder()
                .userName(userSignupRequestDto.getUserName())
                .userEmail(userSignupRequestDto.getUserEmail())
                .userCampus(userSignupRequestDto.getUserCampus())
                .userGender(userSignupRequestDto.getUserGender())
                .userPhone(userSignupRequestDto.getUserPhone())
                .userClass(userSignupRequestDto.getUserClass())
                .userBirth(userSignupRequestDto.getUserBirth())
                .userPw(hashPassword(userSignupRequestDto.getUserPw()))
                .userNickname(userSignupRequestDto.getUserNickname())
                .userGeneration(userSignupRequestDto.getUserGeneration())
                .userRole(0)
                .userProfileImage("")
                .build();

        userRepository.save(user);
        return true;
    }


    private String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public UserInfoResponseDto getUserInfo(int userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            return null;
        }

        UserInfoResponseDto dto = UserInfoResponseDto.builder()
                .userId(user.getUserId())
                .userEmail(user.getUserEmail())
                .userName(user.getUserName())
                .userNickname(user.getUserNickname())
                .userPhone(user.getUserPhone())
                .userBirth(user.getUserBirth())
                .userGeneration(user.getUserGeneration())
                .userCampus(user.getUserCampus())
                .userClass(user.getUserClass())
                .userGender(user.getUserGender())
                .userSkills(user.getUserSkills())
                .userProfileImage(user.getUserProfileImage())
                .userProfileMessage(user.getUserProfileMessage())
                .userRole(user.getUserRole())
                .build();

        return dto;
    }

}
