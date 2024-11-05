package com.e203.recruiting.response;

import com.e203.global.entity.ProjectDomain;
import com.e203.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingPostResponseDto {

    private int postId;

    private String postTitle;

    private String postContent;

    private LocalDate startDate;

    private LocalDate endDate;

    private int firstDomain;

    private int secondDomain;

    private int campus;

    private int memberTotal;

    private int memberInfra;

    private int memberBackend;

    private int memberFrontend;

    private int recruitingTotal;

    private List<RecruitingMemberResponseDto> recruitingMembers;
}
