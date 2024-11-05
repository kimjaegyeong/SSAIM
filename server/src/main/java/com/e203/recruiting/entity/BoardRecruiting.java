package com.e203.recruiting.entity;

import com.e203.global.entity.BaseEntity;
import com.e203.global.entity.ProjectDomain;
import com.e203.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "board_recruiting")
public class BoardRecruiting extends BaseEntity {

    @Id
    @Column(name = "board_recruiting_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recruitingId;

    @ManyToOne
    @JoinColumn(name = "board_recruiting_author", nullable = false)
    private User author;

    @Column(name = "board_recruiting_title")
    private String title;

    @Column(name = "board_recruiting_content")
    private String content;

    @Column(name = "board_recruiting_start_date")
    private LocalDate startDate;

    @Column(name = "board_recruiting_end_date")
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "board_recruiting_first_domain")
    private ProjectDomain firstDomain;

    @ManyToOne
    @JoinColumn(name = "board_recruiting_second_domain")
    private ProjectDomain secondDomain;

    @Column(name = "board_recruiting_campus")
    private Integer campus;

    @Column(name = "board_recruiting_member_total")
    private Integer memberTotal;

    @Column(name = "board_recruiting_member_infra")
    private Integer memberInfra;

    @Column(name = "board_recruiting_member_backend")
    private Integer memberBackend;

    @Column(name = "board_recruiting_member_frontend")
    private Integer memberFrontend;

    @Setter
    @OneToMany(mappedBy = "boardRecruiting", cascade = CascadeType.ALL)
    private List<RecruitingMember> recruitingMembers;

    @Builder
    private BoardRecruiting(User author, String title, String content, LocalDate startDate, LocalDate endDate,
                            ProjectDomain firstDomain, ProjectDomain secondDomain, Integer campus, Integer memberTotal,
                            Integer memberInfra, Integer memberBackend, Integer memberFrontend) {
        this.author = author;
        this.title = title;
        this.content = content;
        this.startDate = startDate;
        this.endDate = endDate;
        this.firstDomain = firstDomain;
        this.secondDomain = secondDomain;
        this.campus = campus;
        this.memberTotal = memberTotal;
        this.memberInfra = memberInfra;
        this.memberBackend = memberBackend;
        this.memberFrontend = memberFrontend;

    }
}
