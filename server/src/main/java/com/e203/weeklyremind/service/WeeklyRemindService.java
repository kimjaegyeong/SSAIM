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

        if(!userRepository.existsById(message.getUserId())) {
            return false;
        }

        String summary = chatAiService.generateWeeklyRemind(message, projectId);

        Optional<User> user = userRepository.findById(message.getUserId());
        ProjectMember author = null;
        if(user.isPresent()) {
            author = projectMemberRepository.findByUser(user.get());
        }
        Project project = null;
        if(projectRepository.existsById(projectId)) {
            project = projectRepository.findById(projectId).get();
        }

        WeeklyRemind weeklyRemind = WeeklyRemind.builder()
                .weeklyRemindContents(summary)
                .projectId(project)
                .remindAuthor(author).build();

        weeklyRemindRepository.save(weeklyRemind);

        return true;
    }

    public List<WeeklyRemindResponseDto> searchWeeklyRemind (int projectId, int author) {

        Project project = projectRepository.findById(projectId)
                .orElse(null);

        ProjectMember authorMember = projectMemberRepository.findById(author)
                .orElse(null);

        //내가 진행중인 플젝의 주간회고만 가져오기
        List<WeeklyRemind> weeklyRemindList = weeklyRemindRepository.findWeeklyRemindByRemindAuthorAndProjectId(authorMember, project);
        List<WeeklyRemindResponseDto> weeklyRemindResponseDtoList = new ArrayList<>();

        for(WeeklyRemind weeklyRemind : weeklyRemindList) {
            weeklyRemindResponseDtoList.add(WeeklyRemindResponseDto.builder()
                    .author(weeklyRemind.getRemindAuthor().getId())
                    .projectId(weeklyRemind.getProjectId().getId())
                    .content(weeklyRemind.getWeeklyRemindContents()).build());
        }

        return weeklyRemindResponseDtoList;
    }
}
