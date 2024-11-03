package com.e203.user.controller;

import com.e203.user.request.UserLoginRequestDto;
import com.e203.user.request.UserSignUpRequestDto;
import com.e203.user.response.UserInfoResponseDto;
import com.e203.user.service.UserDetailServiceImpl;
import com.e203.user.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class UserController {

    private final UserService userService;

    private final UserDetailServiceImpl userDetailService;

    @PostMapping("/api/v1/users")
    public ResponseEntity<String> signUp(@RequestBody UserSignUpRequestDto userSignUpRequestDto, @RequestParam(value = "userProfileImage", required = false) MultipartFile profileImage) {
        boolean isSucceed = userService.createUser(userSignUpRequestDto, profileImage);
        if (isSucceed) {
            return ResponseEntity.status(200).body("회원가입이 완료되었습니다.");
        } else {
            return ResponseEntity.status(200).body("이미 가입한 이메일입니다.");
        }
    }

    @PatchMapping("/api/v1/users/{userId}")
    public ResponseEntity<String> editInfo() {
        return ResponseEntity.status(200).body("회원 정보 수정이 완료되었습니다.");
    }

    @GetMapping("/api/v1/users/{userId}")
    public ResponseEntity<UserInfoResponseDto> lookUp(@RequestParam int userId) {
        UserInfoResponseDto dto = userService.getUserInfo(userId);
        if (dto == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.status(200).body(dto);
    }


}
