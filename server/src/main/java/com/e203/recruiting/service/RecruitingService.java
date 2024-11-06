package com.e203.recruiting.service;

import com.e203.global.entity.ProjectDomain;
import com.e203.recruiting.entity.BoardRecruiting;
import com.e203.recruiting.entity.RecruitingMember;
import com.e203.recruiting.repository.RecruitingRepository;
import com.e203.recruiting.request.RecruitingWriteRequestDto;
import com.e203.recruiting.response.RecruitingCandidateResponseDto;
import com.e203.recruiting.response.RecruitingMemberResponseDto;
import com.e203.recruiting.response.RecruitingPostDetailResponseDto;
import com.e203.recruiting.response.RecruitingPostResponseDto;
import com.e203.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional
    public RecruitingPostDetailResponseDto getPost(int postId, int userId) {

        BoardRecruiting recruiting = recruitingRepository.findByRecruitingId(postId);
        if (recruiting == null) {
            return null;
        }

        List<RecruitingMemberResponseDto> recruitingMembers;
        List<RecruitingCandidateResponseDto> recruitingCandidates;

        recruitingMembers = recruiting.getRecruitingMembers().stream().filter(
                        member -> member.getRecruitingMemberStatus() == 1
                )
                .map(RecruitingMemberResponseDto::fromEntity).toList();

        // 작성자라면, 지원자가 모두 보이게
        if (userId == recruiting.getAuthor().getUserId()) {
            recruitingCandidates =
                    recruiting.getRecruitingMembers().stream().filter(
                                    member -> member.getRecruitingMemberStatus() != 1
                            )
                            .map(RecruitingCandidateResponseDto::fromEntity).toList();
        } else {    // 작성자가 아니라면, 본인의 지원만 보이게
            recruitingCandidates =
                    recruiting.getRecruitingMembers().stream().filter(
                                    member -> member.getUser().getUserId() == userId
                                            && member.getRecruitingMemberStatus() != 1
                            )
                            .map(RecruitingCandidateResponseDto::fromEntity).toList();
        }

        RecruitingPostDetailResponseDto dto = RecruitingPostDetailResponseDto.fromEntity(recruiting, recruitingMembers,
                recruitingCandidates);

        dto.setRecruitedTotal(recruitingMembers.size());
        dto.setCandidateCount(recruiting.getRecruitingMembers().size() - recruitingMembers.size());
        return dto;
    }

    public List<RecruitingPostResponseDto> searchPosts(String title, Integer position, Integer campus,
                                                       Integer domain, Integer status, Integer page) {

        Pageable pageable = PageRequest.of(page - 1, 5);
        return recruitingRepository.searchPosts(title, position, campus, domain, status, pageable).stream()
                .map(RecruitingPostResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
