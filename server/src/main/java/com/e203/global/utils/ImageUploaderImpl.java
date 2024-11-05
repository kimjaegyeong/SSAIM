package com.e203.global.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ImageUploaderImpl implements ImageUploader{

    @Override
    public String upload(MultipartFile profileImage) {
        return "";
    }
}
