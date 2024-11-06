package com.e203.recruiting.service;

import com.e203.global.entity.ProjectDomain;
import com.e203.recruiting.entity.BoardRecruiting;
import com.e203.recruiting.entity.RecruitingMember;
import com.e203.recruiting.repository.RecruitingRepository;
import com.e203.recruiting.request.RecruitingEditRequestDto;
import com.e203.recruiting.request.RecruitingMemberEditRequestDto;
import com.e203.recruiting.request.RecruitingWriteRequestDto;
import com.e203.recruiting.response.RecruitingCandidateResponseDto;
import com.e203.recruiting.response.RecruitingMemberResponseDto;
import com.e203.recruiting.response.RecruitingPostDetailResponseDto;
import com.e203.recruiting.response.RecruitingPostResponseDto;
import com.e203.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
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

    @Transactional
    public String updatePost(int postId, RecruitingEditRequestDto dto, int userId) {
        BoardRecruiting post = recruitingRepository.findByRecruitingId(postId);
        if (post == null) {
            return "Not found";
        }
        if (post.getAuthor().getUserId() != userId) {
            return "Not authorized";
        }

        updatePostFields(post, dto);


        if (dto.getRecruitingMembers() != null) {
            List<RecruitingMember> members = post.getRecruitingMembers();
            List<RecruitingMember> newMembers = new ArrayList<>();
            for (RecruitingMember member : members) {
                for (RecruitingMemberEditRequestDto memberEdit : dto.getRecruitingMembers()) {
                    if (member.getUser().getUserId() == memberEdit.getUserId()) {
                        member.setRecruitingMemberPosition(memberEdit.getPosition());
                        if (memberEdit.isDelete()) {
                            member.setDeletedAt(LocalDateTime.now());
                        }
                    }
                }
            }
        }


        return "";
    }

    private void updatePostFields(BoardRecruiting post, RecruitingEditRequestDto dto) {
        updateField(dto.getTitle(), post::setTitle);
        updateField(dto.getContent(), post::setContent);
        updateField(dto.getCampus(), post::setCampus);
        updateField(dto.getStartDate(), post::setStartDate);
        updateField(dto.getEndDate(), post::setEndDate);
        updateField(dto.getMemberFrontend(), post::setMemberFrontend);
        updateField(dto.getMemberBackend(), post::setMemberBackend);
        updateField(dto.getMemberInfra(), post::setMemberInfra);
        updateField(dto.getMemberTotal(), post::setMemberTotal);
        if (dto.getFirstDomain() != null) {
            updateField(new ProjectDomain(dto.getFirstDomain()), post::setFirstDomain);
        } else {
            post.setFirstDomain(null);
        }
        if (dto.getSecondDomain() != null) {
            updateField(new ProjectDomain(dto.getSecondDomain()), post::setSecondDomain);
        } else {
            post.setSecondDomain(null);
        }
    }

    private <T> void updateField(T value, Consumer<T> setter) {
        Optional.ofNullable(value).ifPresent(setter);
    }


}
