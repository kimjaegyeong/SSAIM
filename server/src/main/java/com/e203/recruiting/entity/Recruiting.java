package com.e203.recruiting.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "recruiting")
public class Recruiting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recruitingId;

}
