package com.e203.recruiting.service;

import com.e203.global.entity.ProjectDomain;
import com.e203.recruiting.entity.BoardRecruiting;
import com.e203.recruiting.entity.RecruitingMember;
import com.e203.recruiting.repository.RecruitingRepository;
import com.e203.recruiting.request.RecruitingWriteRequestDto;
import com.e203.recruiting.response.RecruitingPostResponseDto;
import com.e203.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecruitingService {

    private final RecruitingRepository recruitingRepository;

    @Transactional
    public void createPost(RecruitingWriteRequestDto dto) {

        BoardRecruiting boardRecruiting = BoardRecruiting.builder()
                .author(new User(dto.getAuthor()))
                .title(dto.getTitle())
                .content(dto.getContent())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .firstDomain(new ProjectDomain(dto.getFirstDomain()))
                .secondDomain(new ProjectDomain(dto.getSecondDomain()))
                .campus(dto.getCampus())
                .memberTotal(dto.getMemberTotal())
                .memberInfra(dto.getMemberInfra())
                .memberFrontend(dto.getMemberFrontend())
                .memberBackend(dto.getMemberBackend())
                .build();

        boardRecruiting.setRecruitingMembers(List.of(RecruitingMember.builder()
                .boardRecruiting(boardRecruiting)
                .user(boardRecruiting.getAuthor())
                .build()));

        recruitingRepository.save(boardRecruiting);

    }

    public RecruitingPostResponseDto getPost(int postId, int userId) {

        recruitingRepository.findByRecruitingId(postId);
        return null;
    }
}
