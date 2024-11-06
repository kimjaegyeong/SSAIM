package com.e203.recruiting.response;

import com.e203.recruiting.entity.RecruitingMember;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingMemberResponseDto {

    private Integer userId;

    private String userName;

    private String profileImage;

    private Integer position;

    private String userEmail;

    @Builder
    private RecruitingMemberResponseDto(Integer userId, String userName, String profileImage,
                                        Integer position, String userEmail) {
        this.userId = userId;
        this.userName = userName;
        this.profileImage = profileImage;
        this.position = position;
        this.userEmail = userEmail;
    }

    RecruitingMemberResponseDto(RecruitingMember member) {
        this.userId = member.getUser().getUserId();
        this.userName = member.getUser().getUserName();
        this.profileImage = member.getUser().getUserProfileImage();
        this.position = member.getRecruitingMemberPosition();
        this.userEmail = member.getUser().getUserEmail();
    }

    public static RecruitingMemberResponseDto fromEntity(RecruitingMember member) {
        return RecruitingMemberResponseDto.builder()
                .userId(member.getUser().getUserId())
                .userName(member.getUser().getUserName())
                .userEmail(member.getUser().getUserEmail())
                .position(member.getRecruitingMemberPosition())
                .profileImage(member.getUser().getUserProfileImage())
                .build();
    }
}
