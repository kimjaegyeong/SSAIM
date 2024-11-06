package com.e203.recruiting.response;

import com.e203.global.entity.ProjectDomain;
import com.e203.recruiting.entity.BoardRecruiting;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingPostResponseDto {

    private Integer postId;

    private Integer authorId;

    private String authorProfileImageUrl;

    private String authorName;

    private String postTitle;

    private String postContent;

    private Integer firstDomain;

    private Integer secondDomain;

    private Integer campus;

    private Integer memberTotal;

    private Integer memberInfra;

    private Integer memberBackend;

    private Integer memberFrontend;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    private Integer status;

    @Setter
    private Integer recruitedTotal;

    @Builder
    private RecruitingPostResponseDto(Integer postId, Integer authorId, String authorProfileImageUrl, String authorName, String postTitle,
                                      String postContent, Integer firstDomain, Integer secondDomain, Integer campus,
                                      Integer memberTotal, Integer memberInfra, Integer memberBackend, Integer memberFrontend,
                                      LocalDateTime createdDate, LocalDateTime updatedDate, Integer status) {
        this.postId = postId;
        this.authorId = authorId;
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
        this.authorId = recruiting.getAuthor().getUserId();
        this.authorProfileImageUrl = recruiting.getAuthor().getUserProfileImage();
        this.authorName = recruiting.getAuthor().getUserName();
        this.postTitle = recruiting.getTitle();
        this.postContent = recruiting.getContent();
        this.firstDomain = Optional.ofNullable(recruiting.getFirstDomain())
                .map(ProjectDomain::getProjectDomainId)
                .orElse(null);
        this.secondDomain = Optional.ofNullable(recruiting.getSecondDomain())
                .map(ProjectDomain::getProjectDomainId)
                .orElse(null);
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
                .authorId(recruiting.getAuthor().getUserId())
                .authorProfileImageUrl(recruiting.getAuthor().getUserProfileImage())
                .authorName(recruiting.getAuthor().getUserName())
                .postTitle(recruiting.getTitle())
                .postContent(recruiting.getContent())
                .firstDomain(Optional.ofNullable(recruiting.getFirstDomain())
                        .map(ProjectDomain::getProjectDomainId)
                        .orElse(null))
                .secondDomain(Optional.ofNullable(recruiting.getSecondDomain())
                        .map(ProjectDomain::getProjectDomainId)
                        .orElse(null))
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
