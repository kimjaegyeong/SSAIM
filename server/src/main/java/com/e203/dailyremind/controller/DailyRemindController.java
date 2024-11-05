package com.e203.dailyremind.controller;

import org.springframework.http.HttpStatusCode;
import com.e203.dailyremind.request.DailyRemindRequestDto;
import com.e203.dailyremind.service.DailyRemindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequiredArgsConstructor
public class DailyRemindController {

    private final DailyRemindService dailyRemindService;

    @PostMapping("/api/v1/projects/{projectId}/daily-remind")
    public ResponseEntity<String> addDailyRemind(@PathVariable("projectId") int projectId, @RequestBody DailyRemindRequestDto requestDto) {

        boolean result = dailyRemindService.saveDailyRemind(requestDto, projectId);

        if (result) {
            return ResponseEntity.status(OK).body("일일회고가 저장되었습니다.");
        }
        else {
            return ResponseEntity.status(OK).body("일일회고 저장에 실패하였습니다.");
        }
    }
}
