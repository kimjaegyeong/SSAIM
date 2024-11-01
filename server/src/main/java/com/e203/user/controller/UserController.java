package com.e203.user.controller;

import com.e203.user.request.UserLoginRequestDto;
import com.e203.user.request.UserSignUpRequestDto;
import com.e203.user.service.UserDetailServiceImpl;
import com.e203.user.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class UserController {

    private final UserService userService;

    private final UserDetailServiceImpl userDetailService;

    @PostMapping("/api/v1/users")
    public ResponseEntity<String> signUp(@RequestBody UserSignUpRequestDto userSignUpRequestDto, @RequestParam(value = "userProfileImage", required = false) MultipartFile profileImage) {
        boolean isSucceed = userService.createUser(userSignUpRequestDto, profileImage);
        if (isSucceed) {
            return ResponseEntity.status(200).body("회원가입이 완료 되었습니다.");
        } else {
            return ResponseEntity.status(200).body("이미 가입한 이메일입니다.");
        }
    }

}
