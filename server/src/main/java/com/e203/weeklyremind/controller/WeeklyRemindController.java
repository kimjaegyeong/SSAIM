package com.e203.weeklyremind.controller;

import org.springframework.http.HttpStatusCode;
import com.e203.weeklyremind.request.WeeklyRemindRequestDto;
import com.e203.weeklyremind.response.WeeklyRemindResponseDto;
import com.e203.weeklyremind.service.ChatAiService;
import com.e203.weeklyremind.service.WeeklyRemindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.OK;


@RestController
@RequiredArgsConstructor
public class WeeklyRemindController {

    private final WeeklyRemindService weeklyRemindService;
    private final ChatAiService chatAiService;

    @PostMapping("/api/v1/projects/{projectId}/weekly-remind")
    public ResponseEntity<String> createWeeklyRemind(@RequestBody WeeklyRemindRequestDto message, @PathVariable int projectId) {

        boolean isSucceed = weeklyRemindService.saveWeeklyRemind(message, projectId);

        if(isSucceed) {
            return ResponseEntity.status(OK).body("주간 회고가 생성되었습니다.");
        }
        else {
            return ResponseEntity.status(OK).body("주간 회고가 생성되지 않았습니다.");
        }
    }

    @GetMapping("/api/v1/projects/{projectId}/weekly-remind")
    public ResponseEntity<List<WeeklyRemindResponseDto>> getWeeklyRemind(
            @PathVariable int projectId,
            @RequestParam(required = false) Integer projectMemberId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate){

        List<WeeklyRemindResponseDto> weeklyRemindList = weeklyRemindService.searchWeeklyRemind(projectId, projectMemberId,
                startDate, endDate);

        return ResponseEntity.status(OK).body(weeklyRemindList);
    }

    @GetMapping("/api/v1/projects/development-story/{projectMemberId}")
    public ResponseEntity<List<WeeklyRemindResponseDto>> getDevelopmentStory(@PathVariable("author") int author) {

        List<WeeklyRemindResponseDto> result = weeklyRemindService.searchDevelopmentStory(author);

        if(result == null) {
            return ResponseEntity.status(FORBIDDEN).body(null);
        }

        return ResponseEntity.status(OK).body(result);
    }


}
