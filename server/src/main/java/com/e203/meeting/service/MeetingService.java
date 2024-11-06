package com.e203.meeting.service;

import com.e203.meeting.entity.Meeting;
import com.e203.meeting.repository.MeetingRepository;
import com.e203.meeting.response.MeetingResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final ProjectRepository projectRepository;

    public List<MeetingResponseDto> getMeetings(int projectId) {

        Project project = projectRepository.findById(projectId).orElse(null);

        if (project == null) {
            return null;
        }

        List<Meeting> meetingList = meetingRepository.findByprojectId(project);
        List<MeetingResponseDto> meetingResponseDtoList = new ArrayList<>();

        for (Meeting meeting : meetingList) {
            meetingResponseDtoList.add(MeetingResponseDto.builder()
                    .meetingId(meeting.getMeetingId())
                    .meetingTitle(meeting.getMeetingTitle())
                    .meetingVoiceScript(meeting.getMeetingVoiceScript())
                    .meetingVoiceUrl(meeting.getMeetingVoiceUrl())
                    .projectId(meeting.getProjectId().getId())
                    .meetingCreateTime(meeting.getCreatedAt()).build());
        }

        return meetingResponseDtoList;
    }
}
