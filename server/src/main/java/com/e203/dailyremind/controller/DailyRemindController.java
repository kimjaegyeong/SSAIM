package com.e203.dailyremind.controller;

import com.e203.dailyremind.response.DailyRemindResponseDto;
import org.springframework.http.HttpStatusCode;
import com.e203.dailyremind.request.DailyRemindRequestDto;
import com.e203.dailyremind.service.DailyRemindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequiredArgsConstructor
public class DailyRemindController {

    private final DailyRemindService dailyRemindService;

    @GetMapping("/api/v1/projects/{projectId}/daily-remind/{author}")
    public ResponseEntity<List<DailyRemindResponseDto>> getDailyRemind(@PathVariable("projectId") int projectId, @PathVariable("author") int author) {

        List<DailyRemindResponseDto> results = dailyRemindService.searchDailyRemind(projectId, author);

        return ResponseEntity.status(OK).body(results);
    }

    @GetMapping("/api/v1/projects/{projectId}/daily-remind")
    public ResponseEntity<List<DailyRemindResponseDto>> getTeamDailyRemind(@PathVariable("projectId") int projectId) {

        List<DailyRemindResponseDto> results = dailyRemindService.searchTeamDailyRemind(projectId);

        return ResponseEntity.status(OK).body(results);
    }
}
