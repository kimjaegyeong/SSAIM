package com.e203.recruiting.response;

import com.e203.recruiting.entity.BoardRecruiting;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingPostResponseDto {

    private int postId;

    private String authorProfileImageUrl;

    private String authorName;

    private String postTitle;

    private String postContent;

    private int firstDomain;

    private int secondDomain;

    private int campus;

    private int memberTotal;

    private int memberInfra;

    private int memberBackend;

    private int memberFrontend;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    private Integer status;

    @Setter
    private int recruitedTotal;

    @Builder
    private RecruitingPostResponseDto(int postId, String authorProfileImageUrl, String authorName, String postTitle,
                                      String postContent, int firstDomain, int secondDomain, int campus,
                                      int memberTotal, int memberInfra, int memberBackend, int memberFrontend,
                                      LocalDateTime createdDate, LocalDateTime updatedDate, Integer status) {
        this.postId = postId;
        this.authorProfileImageUrl = authorProfileImageUrl;
        this.authorName = authorName;
        this.postTitle = postTitle;
        this.postContent = postContent;
        this.firstDomain = firstDomain;
        this.secondDomain = secondDomain;
        this.campus = campus;
        this.memberTotal = memberTotal;
        this.memberInfra = memberInfra;
        this.memberBackend = memberBackend;
        this.memberFrontend = memberFrontend;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.status = status;
    }

    RecruitingPostResponseDto(BoardRecruiting recruiting) {
        this.postId = recruiting.getRecruitingId();
        this.authorProfileImageUrl = recruiting.getAuthor().getUserProfileImage();
        this.authorName = recruiting.getAuthor().getUserName();
        this.postTitle = recruiting.getTitle();
        this.postContent = recruiting.getContent();
        this.firstDomain = recruiting.getFirstDomain().getProjectDomainId();
        this.secondDomain = recruiting.getSecondDomain().getProjectDomainId();
        this.campus = recruiting.getCampus();
        this.memberTotal = recruiting.getMemberTotal();
        this.memberInfra = recruiting.getMemberInfra();
        this.memberBackend = recruiting.getMemberBackend();
        this.memberFrontend = recruiting.getMemberFrontend();
        this.createdDate = recruiting.getCreatedAt();
        this.updatedDate = recruiting.getModifiedAt();
        this.status = recruiting.getStatus();
    }

    public static RecruitingPostResponseDto fromEntity(BoardRecruiting recruiting) {
        return RecruitingPostResponseDto.builder()
                .postId(recruiting.getRecruitingId())
                .authorProfileImageUrl(recruiting.getAuthor().getUserProfileImage())
                .authorName(recruiting.getAuthor().getUserName())
                .postTitle(recruiting.getTitle())
                .postContent(recruiting.getContent())
                .firstDomain(recruiting.getFirstDomain().getProjectDomainId())
                .secondDomain(recruiting.getSecondDomain().getProjectDomainId())
                .campus(recruiting.getCampus())
                .memberTotal(recruiting.getMemberTotal())
                .memberInfra(recruiting.getMemberInfra())
                .memberBackend(recruiting.getMemberBackend())
                .memberFrontend(recruiting.getMemberFrontend())
                .createdDate(recruiting.getCreatedAt())
                .updatedDate(recruiting.getModifiedAt())
                .status(recruiting.getStatus())
                .build();
    }
}
