package com.e203.meeting.service;

import com.e203.meeting.entity.Meeting;
import com.e203.meeting.repository.MeetingRepository;
import com.e203.meeting.request.MeetingRequestDto;
import com.e203.meeting.response.MeetingResponseDto;
import com.e203.meeting.response.SttResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectRepository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;


import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final NaverCloudClient naverCloudClient;
    private final MeetingRepository meetingRepository;
    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<MeetingResponseDto> getMeetings(int projectId) throws Exception {

        Project project = projectRepository.findById(projectId).orElse(null);

        if (project == null) {
            return null;
        }

        List<Meeting> meetingList = meetingRepository.findByprojectId(project);
        List<MeetingResponseDto> meetingResponseDtoList = new ArrayList<>();

        for (Meeting meeting : meetingList) {
            //jsonString을 Json으로 변경
            SttResponseDto sttResponseDto = objectMapper.readValue(meeting.getMeetingVoiceScript(), SttResponseDto.class);

            meetingResponseDtoList.add(MeetingResponseDto.builder()
                    .meetingId(meeting.getMeetingId())
                    .meetingTitle(meeting.getMeetingTitle())
                    .meetingVoiceScript(sttResponseDto)
                    .meetingVoiceUrl(meeting.getMeetingVoiceUrl())
                    .projectId(meeting.getProjectId().getId())
                    .meetingCreateTime(meeting.getCreatedAt())
                    .meetingVoiceTime(meeting.getMeetingVoiceTime()).build());
        }

        return meetingResponseDtoList;
    }

    public MeetingResponseDto getMeeting(int meetingId) throws Exception{
        Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
        if (meeting == null) {
            return null;
        }

        //jsonString을 Json으로 변경
        SttResponseDto sttResponseDto = objectMapper.readValue(meeting.getMeetingVoiceScript(), SttResponseDto.class);

        return MeetingResponseDto.builder()
                .meetingCreateTime(meeting.getCreatedAt())
                .projectId(meeting.getProjectId().getId())
                .meetingId(meeting.getMeetingId())
                .meetingTitle(meeting.getMeetingTitle())
                .meetingVoiceUrl(meeting.getMeetingVoiceUrl())
                .meetingVoiceScript(sttResponseDto)
                .meetingVoiceTime(meeting.getMeetingVoiceTime()).build();
    }
    public boolean createMeeting(MeetingRequestDto meetingRequestDto, MultipartFile audiofile) throws Exception {

        Project project = projectRepository.findById(meetingRequestDto.getProjectId()).orElse(null);
        if (project == null) {
            return false;
        }

        // 클로버 AI 쓰는 부분
        NaverCloudClient.NestRequestEntity requestEntity = new NaverCloudClient.NestRequestEntity();
        //AI 결과물을 String으로 저장
        String upload = naverCloudClient.upload(audiofile, requestEntity);

        Meeting meeting = Meeting.builder()
                .meetingTitle(meetingRequestDto.getMeetingTitle())
                .meetingVoiceScript(upload)
                .meetingVoiceUrl("")
                .projectId(project)
                .meetingVoiceTime(getLastEndValue(upload)).build();

        meetingRepository.save(meeting);

        return true;

    }

    // 음성 길이 반환(초 단위)
    private int getLastEndValue(String jsonString) {
        try {
            // JSON 문자열을 JsonNode로 파싱
            JsonNode rootNode = objectMapper.readTree(jsonString);

            // segments 배열 접근
            JsonNode segmentsNode = rootNode.path("segments");
            if (segmentsNode.isArray() && segmentsNode.size() > 0) {
                // 마지막 segment의 end 값 가져오기
                return segmentsNode.get(segmentsNode.size() - 1).path("end").asInt() / 1000;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // segments가 없거나 오류 발생 시 -1 반환
        return -1;
    }


}
