package com.e203.weeklyremind.service;

import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import com.e203.weeklyremind.entity.WeeklyRemind;
import com.e203.weeklyremind.repository.WeeklyRemindRepository;
import com.e203.weeklyremind.request.WeeklyRemindRequestDto;
import com.e203.weeklyremind.response.WeeklyRemindResponseDto;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class WeeklyRemindService {

    private final WeeklyRemindRepository weeklyRemindRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final ChatAiService chatAiService;
    private final ProjectRepository projectRepository;

    public boolean saveWeeklyRemind(WeeklyRemindRequestDto message, int projectId) {

        String summary = chatAiService.generateWeeklyRemind(message, projectId);

        ProjectMember projectMember = projectMemberRepository
                .findById(message.getProjectMemberId())
                .orElse(null);

        if (projectMember == null) {
            return false;
        }
        Project project = projectRepository.findById(projectId).orElse(null);

        WeeklyRemind weeklyRemind = WeeklyRemind.builder()
                .weeklyRemindContents(summary)
                .projectId(project)
                .weeklyRemindAuthor(projectMember)
                .weeklyRemindDate(message.getWeeklyRemindDate()).build();

        weeklyRemindRepository.save(weeklyRemind);

        return true;
    }

    public List<WeeklyRemindResponseDto> searchWeeklyRemind (int projectId, Integer author
            ,LocalDate startDate, LocalDate endDate) {

        List<WeeklyRemind> weeklyRemindList = weeklyRemindRepository.findWeeklyReminds(projectId, startDate
        , endDate, author);
        List<WeeklyRemindResponseDto> weeklyRemindResponseDtoList = new ArrayList<>();

        for(WeeklyRemind weeklyRemind : weeklyRemindList) {
            weeklyRemindResponseDtoList.add(WeeklyRemindResponseDto.builder()
                    .projectMemberId(weeklyRemind.getWeeklyRemindAuthor().getId())
                    .projectId(weeklyRemind.getProjectId().getId())
                    .weeklyRemindId(weeklyRemind.getWeeklyRemindId())
                    .content(weeklyRemind.getWeeklyRemindContents())
                    .username(weeklyRemind.getWeeklyRemindAuthor().getUser().getUserName())
                    .weeklyRemindDate(weeklyRemind.getWeeklyRemindDate())
                    .userImage(weeklyRemind.getWeeklyRemindAuthor().getUser().getUserProfileImage())
                    .build());
        }

        return weeklyRemindResponseDtoList;
    }

    public List<WeeklyRemindResponseDto> searchDevelopmentStory (int author) {

        ProjectMember authorMember = projectMemberRepository.findById(author)
                .orElse(null);

        if(authorMember == null) {
            return null;
        }

        //나의 주간회고만 가져오기
        List<WeeklyRemind> weeklyRemindList = weeklyRemindRepository.findWeeklyRemindByWeeklyRemindAuthor(authorMember);
        List<WeeklyRemindResponseDto> weeklyRemindResponseDtoList = new ArrayList<>();

        for(WeeklyRemind weeklyRemind : weeklyRemindList) {
            weeklyRemindResponseDtoList.add(WeeklyRemindResponseDto.builder()
                    .projectMemberId(weeklyRemind.getWeeklyRemindAuthor().getId())
                    .projectId(weeklyRemind.getProjectId().getId())
                    .weeklyRemindId(weeklyRemind.getWeeklyRemindId())
                    .content(weeklyRemind.getWeeklyRemindContents())
                    .username(weeklyRemind.getWeeklyRemindAuthor().getUser().getUserName()).build());
        }

        return weeklyRemindResponseDtoList;
    }
}
