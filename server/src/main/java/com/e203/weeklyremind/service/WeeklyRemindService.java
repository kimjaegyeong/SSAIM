package com.e203.weeklyremind.service;

import com.e203.project.repository.ProjectMemberRepository;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import com.e203.weeklyremind.entity.WeeklyRemind;
import com.e203.weeklyremind.repository.WeeklyRemindRepository;
import com.e203.weeklyremind.request.WeeklyRemindRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WeeklyRemindService {

    private final WeeklyRemindRepository weeklyRemindRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    public boolean saveWeeklyRemind(String summary, int userId, int projectId) {

        if(!userRepository.existsById(userId)) {
            return false;
        }


        Optional<User> user = userRepository.findById(userId);
        int author = projectMemberRepository.findByUser(user).getId();

        WeeklyRemind weeklyRemind = WeeklyRemind.builder()
                .weeklyRemindContents(summary)
                .projectId(projectId)
                .remindAuthor(author).build();

        weeklyRemindRepository.save(weeklyRemind);

        return true;
    }
}
