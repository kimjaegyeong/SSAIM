package com.e203.recruiting.request;

import com.e203.global.entity.ProjectDomain;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingWriteRequestDto {

    private Integer author;

    private String title;

    private String content;

    private LocalDate startDate;

    private LocalDate endDate;

    private int firstDomain;

    private int secondDomain;

    private int campus;

    private int memberTotal;

    private int memberInfra;

    private int memberBackend;

    private int memberFrontend;

}
