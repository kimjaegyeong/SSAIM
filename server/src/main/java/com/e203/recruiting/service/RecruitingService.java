package com.e203.recruiting.service;

import com.e203.recruiting.repository.RecruitingRepository;
import com.e203.recruiting.request.RecruitingWriteRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecruitingService {

    private final RecruitingRepository recruitingRepository;

    public void createPost(RecruitingWriteRequestDto dto) {


    }
}
