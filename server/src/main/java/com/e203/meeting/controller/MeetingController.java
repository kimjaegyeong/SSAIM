package com.e203.meeting.controller;

import com.e203.meeting.request.MeetingRequestDto;
import com.e203.meeting.response.MeetingResponseDto;
import com.e203.meeting.service.MeetingService;
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
    public ResponseEntity<List<MeetingResponseDto>> getMeetings(@PathVariable("projectId") int projectId) throws Exception{

        List<MeetingResponseDto> result = meetingService.getMeetings(projectId);

        if (result == null) {
            return ResponseEntity.status(OK).body(null);
        }

        return ResponseEntity.status(OK).body(result);
    }

    @GetMapping("/api/v1/projects/{projectId}/meetings/{meetingId}")
    public ResponseEntity<MeetingResponseDto> getMeeting(@PathVariable("meetingId") int meetingId) throws Exception {

        MeetingResponseDto result = meetingService.getMeeting(meetingId);
        if (result == null) {
            return ResponseEntity.status(NOT_FOUND).body(null);
        }

        return ResponseEntity.status(OK).body(result);

    }

    @PostMapping("/api/v1/projects/{projectId}/meetings")
    public ResponseEntity<String> createMeeting(@RequestPart("audiofile") MultipartFile audiofile
                                                        , @RequestPart("meetingRequestDto") MeetingRequestDto meetingRequestDto) throws Exception {
        Boolean result = meetingService.createMeeting(meetingRequestDto, audiofile);

        if (!result) {
            return ResponseEntity.status(FORBIDDEN).body("회의 스크립트 생성에 실패하였습니다.");
        }
        else {
            return ResponseEntity.status(OK).body("회의 스크립트가 생성되었습니다.");
        }
    }
}
