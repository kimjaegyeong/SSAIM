package com.e203.recruiting.entity;

import com.e203.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "recruiting_member")
public class RecruitingMember {

    @Id
    @Column(name = "recruiting_member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "board_recruiting_id", nullable = false)
    private BoardRecruiting boardRecruitingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;

    @Column(name = "recruiting_member_status")
    private int recruitingMemberStatus;

    @Column(name = "recruiting_member_message")
    private String recruitingMemberMessage;

    @Column(name = "recruiting_member_position")
    private int recruitingMemberPosition;

}
