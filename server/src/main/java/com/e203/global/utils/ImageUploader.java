package com.e203.global.utils;

import org.springframework.web.multipart.MultipartFile;

public interface ImageUploader {

    abstract String upload(MultipartFile profileImage);
}
