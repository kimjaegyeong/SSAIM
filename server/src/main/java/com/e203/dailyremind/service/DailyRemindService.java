package com.e203.dailyremind.service;

import com.e203.dailyremind.entity.DailyRemind;
import com.e203.dailyremind.repository.DailyRemindRepository;
import com.e203.dailyremind.request.DailyRemindRequestDto;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyRemindService {

    private final DailyRemindRepository dailyRemindRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public boolean saveDailyRemind(DailyRemindRequestDto requestDto, int projectId) {

        Project project = projectRepository.findById(projectId).get();
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
}
