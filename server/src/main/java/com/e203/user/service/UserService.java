package com.e203.user.service;

import com.e203.global.utils.ImageUploader;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import com.e203.user.request.UserEditInfoDto;
import com.e203.user.request.UserSignUpRequestDto;
import com.e203.user.response.UserInfoResponseDto;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final ImageUploader imageUploader;

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

        return UserInfoResponseDto.fromEntity(user);
    }

    public List<UserInfoResponseDto> searchUsers(String userName, String userEmail, Integer userClass,
                                                 Integer userCampus, Integer userGeneration, String userNickname,
                                                 Integer userRole, LocalDate userBirth, Integer userGender) {

        List<User> users = userRepository.searchUsers(userName, userEmail, userClass, userCampus, userGeneration,
                userNickname, userRole, userBirth, userGender);

        return users.stream().map(UserInfoResponseDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void modifyInfo(int userId, UserEditInfoDto dto, MultipartFile profileImage) {
        String imageUrl = uploadProfileImage(profileImage);
        User user = userRepository.findByUserId(userId);

        updateUserFields(user, dto);
        user.setUserProfileImage(imageUrl);
    }

    private String uploadProfileImage(MultipartFile profileImage) {
        return profileImage != null ? imageUploader.upload(profileImage) : null;
    }

    private void updateUserFields(User user, UserEditInfoDto dto) {
        if (dto.getUserEmail() != null) user.setUserEmail(dto.getUserEmail());
        if (dto.getUserName() != null) user.setUserName(dto.getUserName());
        if (dto.getUserNickname() != null) user.setUserNickname(dto.getUserNickname());
        if (dto.getUserPw() != null) user.setUserPw(hashPassword(dto.getUserPw()));
        if (dto.getUserGender() != null) user.setUserGender(dto.getUserGender());
        if (dto.getUserBirth() != null) user.setUserBirth(dto.getUserBirth());
        if (dto.getUserClass() != null) user.setUserClass(dto.getUserClass());
        if (dto.getUserGeneration() != null) user.setUserGeneration(dto.getUserGeneration());
        if (dto.getUserCampus() != null) user.setUserCampus(dto.getUserCampus());
        if (dto.getUserPhone() != null) user.setUserPhone(dto.getUserPhone());
        if (dto.getUserProfileMessage() != null) user.setUserProfileMessage(dto.getUserProfileMessage());
    }

}
