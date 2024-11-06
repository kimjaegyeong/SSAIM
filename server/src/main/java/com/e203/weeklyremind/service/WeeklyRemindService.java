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
                .weeklyRemindStardDate(message.getStartDate())
                .weeklyRemindEndDate(message.getEndDate()).build();

        weeklyRemindRepository.save(weeklyRemind);

        return true;
    }

    public List<WeeklyRemindResponseDto> searchWeeklyRemind (int projectId, Integer author
            ,LocalDate checkDate ,LocalDate startDate, LocalDate endDate) {

        List<WeeklyRemind> weeklyRemindList = weeklyRemindRepository.findWeeklyReminds(projectId, author
                , checkDate, startDate ,endDate);
        List<WeeklyRemindResponseDto> weeklyRemindResponseDtoList = new ArrayList<>();

        for(WeeklyRemind weeklyRemind : weeklyRemindList) {
            weeklyRemindResponseDtoList.add(WeeklyRemindResponseDto.builder()
                    .projectMemberId(weeklyRemind.getWeeklyRemindAuthor().getId())
                    .projectId(weeklyRemind.getProjectId().getId())
                    .weeklyRemindId(weeklyRemind.getWeeklyRemindId())
                    .content(weeklyRemind.getWeeklyRemindContents())
                    .username(weeklyRemind.getWeeklyRemindAuthor().getUser().getUserName())
                    .startDate(weeklyRemind.getWeeklyRemindStardDate())
                    .endDate(weeklyRemind.getWeeklyRemindEndDate())
                    .userImage(weeklyRemind.getWeeklyRemindAuthor().getUser().getUserProfileImage())
                    .userId(weeklyRemind.getWeeklyRemindAuthor().getUser().getUserId()).build());
        }

        return weeklyRemindResponseDtoList;
    }

    public List<WeeklyRemindResponseDto> searchDevelopmentStory (Integer userId) {

        User user = userRepository.findById(userId).orElse(null);
        if(user == null) {
            return null;
        }

        ProjectMember projectMember = projectMemberRepository.findByUser(user);


        List<WeeklyRemind> weeklyRemindList = weeklyRemindRepository.findWeeklyRemindByWeeklyRemindAuthor(projectMember);
        List<WeeklyRemindResponseDto> weeklyRemindResponseDtoList = new ArrayList<>();

        for(WeeklyRemind weeklyRemind : weeklyRemindList) {
            weeklyRemindResponseDtoList.add(WeeklyRemindResponseDto.builder()
                    .projectMemberId(weeklyRemind.getWeeklyRemindAuthor().getId())
                    .projectId(weeklyRemind.getProjectId().getId())
                    .weeklyRemindId(weeklyRemind.getWeeklyRemindId())
                    .content(weeklyRemind.getWeeklyRemindContents())
                    .username(weeklyRemind.getWeeklyRemindAuthor().getUser().getUserName())
                    .startDate(weeklyRemind.getWeeklyRemindStardDate())
                    .endDate(weeklyRemind.getWeeklyRemindEndDate())
                    .userId(weeklyRemind.getWeeklyRemindAuthor().getUser().getUserId()).build());
        }

        return weeklyRemindResponseDtoList;
    }
}
