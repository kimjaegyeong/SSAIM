package com.e203.dailyremind.controller;

import com.e203.dailyremind.request.DailyRemindRequestDto;
import com.e203.dailyremind.service.DailyRemindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequiredArgsConstructor
public class DailyRemindController {

    private final DailyRemindService dailyRemindService;

    @PutMapping("/api/v1/projects/{projectId}/daily-remind/{dailyRemindId}")
    public ResponseEntity<String> editDailyRemind(@RequestBody DailyRemindRequestDto dailyRemindRequestDto, @PathVariable("dailyRemindId") int dailyRemindId) {

        boolean result = dailyRemindService.putDailyRemind(dailyRemindRequestDto, dailyRemindId);

        if (result) {
            return ResponseEntity.status(OK).body("일일회고가 수정되었습니다.");
        }
        else {
            return ResponseEntity.status(OK).body("일일회고 수정에 실패하였습니다.");
        }
    }
}
