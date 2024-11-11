import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './MeetingCreatePage.module.css';
import Lottie from "lottie-react";
import micWave from "../../../assets/meeting/micWave.json";
import stopIcon from "../../../assets/meeting/stop.png";
import { createMeeting } from '@/features/project/apis/meeting/createMeeting';
import { MeetingPostDTO } from '@features/project/types/meeting/MeetingDTO';

const MeetingCreatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0, milliseconds: 0 });
  const { meetingTitle, selectedParticipants } = location.state || {};
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(true);

  // audioChunks를 useRef로 선언하여 최신 상태 유지
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    console.log('전달된 회의 제목:', meetingTitle);
    console.log('선택된 참가자:', selectedParticipants);

    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          let { minutes, seconds, milliseconds } = prevTime;
          milliseconds += 10;
          if (milliseconds >= 100) {
            milliseconds = 0;
            seconds += 1;
          }
          if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
          }
          return { minutes, seconds, milliseconds };
        });
      }, 100);
    }

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const options = MediaRecorder.isTypeSupported('audio/wav') 
          ? { mimeType: 'audio/wav' }
          : { mimeType: 'audio/webm' }; // 기본값 설정

        const recorder = new MediaRecorder(stream, options);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);
            audioChunksRef.current = [];
            uploadMeeting(audioBlob); // 녹음 종료 후 API 호출
          }
        };

        recorder.start();
      } catch (error) {
        console.error("마이크 접근 권한을 요청하는 중 오류가 발생했습니다:", error);
      }
    };

    if (isRecording) {
      startRecording();
    }

    return () => {
      clearInterval(interval);
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  const handleStopClick = () => {
    console.log("Stop button clicked");
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    } else {
      console.log("Media recorder is not initialized");
    }
  };

  // API 호출 함수
  const uploadMeeting = async (audioBlob: Blob) => {
    if (!projectId || !meetingTitle) return;

    // Blob을 File 객체로 변환
    const audioFile = new File([audioBlob], 'meeting_audio.wav', { type: audioBlob.type });
    console.log("audioFile", audioFile)

    // MeetingPostDTO 객체 생성
    const meetingPostDTO: MeetingPostDTO = {
      audiofile: audioFile,
      meetingRequestDto: {
        meetingTitle,
        projectId: parseInt(projectId),
      },
    };

    try {
      const response = await createMeeting(parseInt(projectId), meetingPostDTO);
      console.log("Meeting created successfully:", response);

      // API 호출 성공 후, 원하는 페이지로 이동
      navigate(`/project/${projectId}/meeting/${response.meetingId}`);
    } catch (error) {
      console.error("Error uploading meeting:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>
        {formatTime(timer.minutes)}:{formatTime(timer.seconds)}:{formatTime(timer.milliseconds)}
      </h1>
      <Lottie animationData={micWave} style={{ width: 400, height: 400 }} />
      <img
        src={stopIcon}
        alt="Stop Icon"
        className={styles.stopIcon}
        onClick={handleStopClick}
        style={{ cursor: 'pointer' }}
      />
      {audioURL && (
        <div>
          <h2>녹음된 파일 미리 듣기:</h2>
          <audio controls src={audioURL}></audio>
        </div>
      )}
    </div>
  );
};

export default MeetingCreatePage;
