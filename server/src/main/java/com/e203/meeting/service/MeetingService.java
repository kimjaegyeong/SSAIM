package com.e203.meeting.service;

import com.e203.meeting.entity.Meeting;
import com.e203.meeting.repository.MeetingRepository;
import com.e203.meeting.response.MeetingResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<MeetingResponseDto> getMeetings(int projectId){

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

    public MeetingResponseDto getMeeting(int meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
        if (meeting == null) {
            return null;
        }

        return MeetingResponseDto.builder()
                .meetingCreateTime(meeting.getCreatedAt())
                .projectId(meeting.getProjectId().getId())
                .meetingId(meeting.getMeetingId())
                .meetingTitle(meeting.getMeetingTitle())
                .meetingVoiceUrl(meeting.getMeetingVoiceUrl())
                .meetingVoiceScript(meeting.getMeetingVoiceScript()).build();
    }
    public String createMeeting(MultipartFile audiofile) throws Exception {
//        final NaverCloudClient naverCloudClient = new NaverCloudClient();
//        System.out.println("최초: " + naverCloudClient.invokeUrlValue);
//        naverCloudClient.init();
//        System.out.println(naverCloudClient.SECRET);
//        System.out.println(naverCloudClient.INVOKE_URL);
        NaverCloudClient.NestRequestEntity requestEntity = new NaverCloudClient.NestRequestEntity();
        return naverCloudClient.upload(audiofile, requestEntity);
    }

//    public List<SpeechRecognitionResult> createMeeting(MultipartFile audiofile) throws Exception{
//
//        try (SpeechClient speechClient = SpeechClient.create()) {
//
//            // Builds the sync recognize request
//            RecognitionConfig config =
//                    RecognitionConfig.newBuilder()
//                            .setEncoding(AudioEncoding.LINEAR16)
//                            .setSampleRateHertz(16000)
//                            .setLanguageCode("ko-KR")
//                            .build();
//
//            ByteString audioBytes = ByteString.copyFrom(audiofile.getBytes());
//
//            RecognitionAudio audio = RecognitionAudio.newBuilder().setContent(audioBytes).build();
//
//            // Performs speech recognition on the audio file
//            RecognizeResponse response = speechClient.recognize(config, audio);
//            List<SpeechRecognitionResult> results = response.getResultsList();
//
////            for (SpeechRecognitionResult result : results) {
////                // There can be several alternative transcripts for a given chunk of speech. Just use the
////                // first (most likely) one here.
////                SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
////                System.out.printf("Transcription: %s%n", alternative.getTranscript());
////            }
//
//            return results;
//        }


}
