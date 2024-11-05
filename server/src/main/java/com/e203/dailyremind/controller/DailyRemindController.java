package com.e203.dailyremind.controller;

import com.e203.dailyremind.request.DailyRemindRequestDto;
import com.e203.dailyremind.service.DailyRemindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.*;
import com.e203.dailyremind.response.DailyRemindResponseDto;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

    @GetMapping("/api/v1/projects/{projectId}/daily-remind/{author}")
    public ResponseEntity<List<DailyRemindResponseDto>> getDailyRemind(@PathVariable("projectId") int projectId, @PathVariable("author") int author) {

        List<DailyRemindResponseDto> results = dailyRemindService.searchDailyRemind(projectId, author);

        if (results == null) {
            return ResponseEntity.status(FORBIDDEN).body(null);
        }

        return ResponseEntity.status(OK).body(results);
    }

    @GetMapping("/api/v1/projects/{projectId}/daily-remind")
    public ResponseEntity<List<DailyRemindResponseDto>> getTeamDailyRemind(@PathVariable("projectId") int projectId) {

        List<DailyRemindResponseDto> results = dailyRemindService.searchTeamDailyRemind(projectId);

        return ResponseEntity.status(OK).body(results);
    }
}
