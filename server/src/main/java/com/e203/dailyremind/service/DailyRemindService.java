package com.e203.dailyremind.service;

import com.e203.dailyremind.entity.DailyRemind;
import com.e203.dailyremind.repository.DailyRemindRepository;
import com.e203.dailyremind.request.DailyRemindRequestDto;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.e203.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyRemindService {

    private final DailyRemindRepository dailyRemindRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Transactional
    public boolean putDailyRemind(DailyRemindRequestDto requestDto, int dailyRemindId) {
        DailyRemind dailyRemind = dailyRemindRepository.findById(dailyRemindId).orElse(null);

        if (dailyRemind == null) {
            return false;
        }

        dailyRemind.updateDailyRemind(requestDto.getDailyRemindContents());

        dailyRemindRepository.save(dailyRemind);

        return true;
    }
}
