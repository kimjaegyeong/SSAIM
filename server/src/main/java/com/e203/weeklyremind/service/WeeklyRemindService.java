package com.e203.weeklyremind.service;

import com.e203.project.repository.ProjectMemberRepository;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import com.e203.weeklyremind.entity.WeeklyRemind;
import com.e203.weeklyremind.repository.WeeklyRemindRepository;
import com.e203.weeklyremind.request.WeeklyRemindRequestDto;
import com.e203.weeklyremind.response.WeeklyRemindResponseDto;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class WeeklyRemindService {

    private final WeeklyRemindRepository weeklyRemindRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final ChatAiService chatAiService;

    public boolean saveWeeklyRemind(WeeklyRemindRequestDto message, int projectId) {

        if(!userRepository.existsById(message.getUserId())) {
            return false;
        }

        String summary = chatAiService.generateWeeklyRemind(message, projectId);

        Optional<User> user = userRepository.findById(message.getUserId());
        int author = projectMemberRepository.findByUser(user).getId();

        WeeklyRemind weeklyRemind = WeeklyRemind.builder()
                .weeklyRemindContents(summary)
                .projectId(projectId)
                .remindAuthor(author).build();

        weeklyRemindRepository.save(weeklyRemind);

        return true;
    }

    public List<WeeklyRemindResponseDto> searchWeeklyRemind (int projectId, int author) {
        List<WeeklyRemind> weeklyRemindList = weeklyRemindRepository.findWeeklyRemindByRemindAuthorAndProjectId(author, projectId);
        List<WeeklyRemindResponseDto> weeklyRemindResponseDtoList = new ArrayList<>();

        for(WeeklyRemind weeklyRemind : weeklyRemindList) {
            weeklyRemindResponseDtoList.add(WeeklyRemindResponseDto.builder()
                    .author(weeklyRemind.getRemindAuthor())
                    .projectId(weeklyRemind.getProjectId())
                    .content(weeklyRemind.getWeeklyRemindContents()).build());
        }

        return weeklyRemindResponseDtoList;
    }
}
