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
        BoardRecruiting recruiting = findRecruitingPost(postId);
        if (recruiting == null) {
            return null;
        }
        List<RecruitingMember> members = recruiting.getRecruitingMembers().stream()
                .filter(member -> member.getDeletedAt() == null).toList();
        List<RecruitingMemberResponseDto> recruitingMembers = getActiveRecruitingMembers(recruiting);
        List<RecruitingCandidateResponseDto> recruitingCandidates = getRecruitingCandidates(recruiting, userId);

        return createResponseDto(recruiting, recruitingMembers, recruitingCandidates);
    }

    private BoardRecruiting findRecruitingPost(int postId) {
        return recruitingRepository.findByRecruitingIdAndDeletedAtIsNull(postId);
    }

    private List<RecruitingMemberResponseDto> getActiveRecruitingMembers(BoardRecruiting recruiting) {
        return recruiting.getRecruitingMembers().stream()
                .filter(member -> member.getRecruitingMemberStatus() == 1)
                .map(RecruitingMemberResponseDto::fromEntity)
                .toList();
    }

    private List<RecruitingCandidateResponseDto> getRecruitingCandidates(BoardRecruiting recruiting, int userId) {
        if (userId == recruiting.getAuthor().getUserId()) {
            return getAllCandidates(recruiting);
        } else {
            return getUserCandidates(recruiting, userId);
        }
    }

    private List<RecruitingCandidateResponseDto> getAllCandidates(BoardRecruiting recruiting) {
        return recruiting.getRecruitingMembers().stream()
                .filter(member -> member.getRecruitingMemberStatus() != 1)
                .map(RecruitingCandidateResponseDto::fromEntity)
                .toList();
    }

    private List<RecruitingCandidateResponseDto> getUserCandidates(BoardRecruiting recruiting, int userId) {
        return recruiting.getRecruitingMembers().stream()
                .filter(member -> member.getUser().getUserId() == userId
                        && member.getRecruitingMemberStatus() != 1)
                .map(RecruitingCandidateResponseDto::fromEntity)
                .toList();
    }

    private RecruitingPostDetailResponseDto createResponseDto(BoardRecruiting recruiting,
                                                              List<RecruitingMemberResponseDto> recruitingMembers,
                                                              List<RecruitingCandidateResponseDto> recruitingCandidates) {
        RecruitingPostDetailResponseDto dto = RecruitingPostDetailResponseDto.fromEntity(recruiting, recruitingMembers, recruitingCandidates);
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
        BoardRecruiting post = findPost(postId);
        if (post == null) {
            return "Not found";
        }

        String authorizationResult = validateUserAuthorization(post, userId);
        if (!authorizationResult.equals("Authorized")) {
            return authorizationResult;
        }

        updatePostFields(post, dto);
        updateRecruitingMembers(post, dto.getRecruitingMembers());

        return "Updated";
    }

    private BoardRecruiting findPost(int postId) {
        return recruitingRepository.findByRecruitingIdAndDeletedAtIsNull(postId);
    }

    private String validateUserAuthorization(BoardRecruiting post, int userId) {
        return post.getAuthor().getUserId() == userId ? "Authorized" : "Not authorized";
    }

    private void updatePostFields(BoardRecruiting post, RecruitingEditRequestDto dto) {
        updateFieldIfPresent(dto.getTitle(), post::setTitle);
        updateFieldIfPresent(dto.getContent(), post::setContent);
        updateFieldIfPresent(dto.getCampus(), post::setCampus);
        updateFieldIfPresent(dto.getStartDate(), post::setStartDate);
        updateFieldIfPresent(dto.getEndDate(), post::setEndDate);
        updateFieldIfPresent(dto.getMemberFrontend(), post::setMemberFrontend);
        updateFieldIfPresent(dto.getMemberBackend(), post::setMemberBackend);
        updateFieldIfPresent(dto.getMemberInfra(), post::setMemberInfra);
        updateFieldIfPresent(dto.getMemberTotal(), post::setMemberTotal);
        updateDomainIfPresent(dto.getFirstDomain(), post::setFirstDomain);
        updateDomainIfPresent(dto.getSecondDomain(), post::setSecondDomain);
    }

    private void updateDomainIfPresent(Integer domain, Consumer<ProjectDomain> setter) {
        setter.accept(domain != null ? new ProjectDomain(domain) : null);
    }

    private void updateRecruitingMembers(BoardRecruiting post, List<RecruitingMemberEditRequestDto> memberEdits) {
        if (memberEdits == null) return;

        for (RecruitingMember member : post.getRecruitingMembers()) {
            memberEdits.stream()
                    .filter(memberEdit -> member.getUser().getUserId() == memberEdit.getUserId())
                    .forEach(memberEdit -> updateMember(member, memberEdit));
        }
    }

    private void updateMember(RecruitingMember member, RecruitingMemberEditRequestDto memberEdit) {
        updateFieldIfPresent(memberEdit.getPosition(), member::setRecruitingMemberPosition);
        if (memberEdit.isDelete()) {
            member.setDeletedAt(LocalDateTime.now());
        }
    }

    private <T> void updateFieldIfPresent(T value, Consumer<T> setter) {
        Optional.ofNullable(value).ifPresent(setter);
    }

}
