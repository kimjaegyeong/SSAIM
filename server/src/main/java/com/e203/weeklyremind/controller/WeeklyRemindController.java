package com.e203.weeklyremind.controller;

import com.e203.weeklyremind.request.WeeklyRemindRequestDto;
import com.e203.weeklyremind.response.WeeklyRemindResponseDto;
import com.e203.weeklyremind.service.ChatAiService;
import com.e203.weeklyremind.service.WeeklyRemindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequiredArgsConstructor
public class WeeklyRemindController {

    private final WeeklyRemindService weeklyRemindService;
    private final ChatAiService chatAiService;

    @PostMapping("/api/v1/projects/{projectId}/weekly-remind")
    public ResponseEntity<String> createWeeklyRemind(@RequestBody WeeklyRemindRequestDto message, @PathVariable int projectId) {

        boolean isSucceed = weeklyRemindService.saveWeeklyRemind(message, projectId);

        if(isSucceed) {
            return ResponseEntity.status(200).body("주간 회고가 생성되었습니다.");
        }
        else {
            return ResponseEntity.status(200).body("주간 회고가 생성되지 않았습니다.");
        }
    }

    @GetMapping("/api/v1/projects/{projectId}/weekly-remind/{author}")
    public ResponseEntity<List<WeeklyRemindResponseDto>> getWeeklyRemind(@PathVariable int projectId, @PathVariable int author) {

        List<WeeklyRemindResponseDto> weeklyRemindList = weeklyRemindService.searchWeeklyRemind(projectId, author);

        return ResponseEntity.status(200).body(weeklyRemindList);
    }


}
