package com.e203.meeting.controller;

import com.e203.meeting.entity.Meeting;
import com.e203.meeting.response.MeetingResponseDto;
import com.e203.meeting.service.MeetingService;
import com.google.cloud.speech.v1.SpeechRecognitionResult;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @GetMapping("/api/v1/projects/{projectId}/meetings")
    public ResponseEntity<List<MeetingResponseDto>> getMeetings(@PathVariable("projectId") int projectId) {

        List<MeetingResponseDto> result = meetingService.getMeetings(projectId);

        if (result == null) {
            return ResponseEntity.status(OK).body(null);
        }

        return ResponseEntity.status(OK).body(result);
    }

    @GetMapping("/api/v1/projects/{projectId}/meetings/{meetingId}")
    public ResponseEntity<MeetingResponseDto> getMeeting(@PathVariable("meetingId") int meetingId) {

        MeetingResponseDto result = meetingService.getMeeting(meetingId);
        if (result == null) {
            return ResponseEntity.status(NOT_FOUND).body(null);
        }

        return ResponseEntity.status(OK).body(result);

    }

    @PostMapping("/api/v1/projects/{projectId}/meetings")
    public ResponseEntity<String> createMeeting(@RequestParam("audiofile") MultipartFile audiofile) throws Exception {
        String result = meetingService.createMeeting(audiofile);

        return ResponseEntity.status(OK).body(result);
    }
}
