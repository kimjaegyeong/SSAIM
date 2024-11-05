package com.e203.dailyremind.service;

import com.e203.dailyremind.entity.DailyRemind;
import com.e203.dailyremind.repository.DailyRemindRepository;
import com.e203.dailyremind.request.DailyRemindRequestDto;
import com.e203.dailyremind.response.DailyRemindResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyRemindService {

    private final DailyRemindRepository dailyRemindRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public boolean saveDailyRemind(DailyRemindRequestDto requestDto, int projectId) {

        Project project = projectRepository.findById(projectId).orElse(null);
        User user = userRepository.findById(requestDto.getDailyRemindAuthor()).orElse(null);
        ProjectMember projectMember = projectMemberRepository.findByUser(user);

        if (user == null) {
            return false;
        }

        DailyRemind dailyRemind = DailyRemind.builder()
                .dailyRemindAuthor(projectMember)
                .dailyRemindContents(requestDto.getDailyRemindContents())
                .project(project).build();

        dailyRemindRepository.save(dailyRemind);

        return true;
    }

    public List<DailyRemindResponseDto> searchDailyRemind(int projectId, int author) {

        Project project = projectRepository.findById(projectId).get();

        ProjectMember projectMember = projectMemberRepository.findByUser(userRepository.findById(author).orElse(null));

        List<DailyRemind> dailyRemindList = dailyRemindRepository.findByProjectIdAndDailyRemindAuthor(project, projectMember);
        List<DailyRemindResponseDto> dailyRemindResponseDtoList = new ArrayList<>();

        if (projectMember == null) {
            return dailyRemindResponseDtoList;
        }


        for (DailyRemind dailyRemind : dailyRemindList) {
            dailyRemindResponseDtoList.add(DailyRemindResponseDto.builder()
                    .memberUserId(dailyRemind.getDailyRemindAuthor().getId())
                    .message(dailyRemind.getDailyRemindContents())
                    .projectId(dailyRemind.getProjectId().getId())
                    .username(dailyRemind.getDailyRemindAuthor().getUser().getUserName())
                    .dailyRemindId(dailyRemind.getDailyRemindId())
                    .userId(dailyRemind.getDailyRemindAuthor().getUser().getUserId())
                    .build());
        }

        return dailyRemindResponseDtoList;
    }

    public List<DailyRemindResponseDto> searchTeamDailyRemind(int projectId) {

        Project project = projectRepository.findById(projectId).get();

        List<DailyRemind> dailyRemindList = dailyRemindRepository.findByProjectId(project);
        List<DailyRemindResponseDto> dailyRemindResponseDtoList = new ArrayList<>();

        for (DailyRemind dailyRemind : dailyRemindList) {
            dailyRemindResponseDtoList.add(DailyRemindResponseDto.builder()
                    .memberUserId(dailyRemind.getDailyRemindAuthor().getId())
                    .message(dailyRemind.getDailyRemindContents())
                    .projectId(dailyRemind.getProjectId().getId())
                    .username(dailyRemind.getDailyRemindAuthor().getUser().getUserName())
                    .dailyRemindId(dailyRemind.getDailyRemindId())
                    .userId(dailyRemind.getDailyRemindAuthor().getUser().getUserId())
                    .build());
        }

        return dailyRemindResponseDtoList;
    }
}
