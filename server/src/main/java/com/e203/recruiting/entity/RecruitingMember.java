package com.e203.recruiting.entity;

import com.e203.global.entity.BaseEntity;
import com.e203.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "recruiting_member")
public class RecruitingMember extends BaseEntity {

    @Id
    @Column(name = "recruiting_member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_recruiting_id", nullable = false)
    private BoardRecruiting boardRecruiting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Setter
    @Column(name = "recruiting_member_status")
    private int recruitingMemberStatus;

    @Setter
    @Column(name = "recruiting_member_message")
    private String recruitingMemberMessage;

    @Setter
    @Column(name = "recruiting_member_position")
    private int recruitingMemberPosition;

    @Builder
    private RecruitingMember(BoardRecruiting boardRecruiting, User user, int recruitingMemberStatus,
                            String recruitingMemberMessage, int recruitingMemberPosition) {
        this.boardRecruiting = boardRecruiting;
        this.user = user;
        this.recruitingMemberStatus = recruitingMemberStatus;
        this.recruitingMemberMessage = recruitingMemberMessage;
        this.recruitingMemberPosition = recruitingMemberPosition;
    }

}
