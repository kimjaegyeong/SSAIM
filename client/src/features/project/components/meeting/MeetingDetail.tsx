import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MeetingDetail.module.css';
import Button from '../../../../components/button/Button';
import SelectSpeakerModal from './SelectSpeakerModal';
import { fectchMeetingDetail } from '../../apis/meeting/fectchMeetingDetail';
import { createAISummary } from '../../apis/meeting/createAISummary';
import { editSpeakers } from '../../apis/meeting/editSpeakers';
import { MeetingDetailDTO, Speaker } from '../../types/meeting/MeetingDTO';
import { formatMeetingTime, formatMeetingDuration } from '../../utils/meetingTime';
import Loading from '@/components/loading/Loading';

const MeetingDetail = () => {
  const { projectId, meetingId } = useParams<{ projectId: string, meetingId: string }>();
  const [meetingData, setMeetingData] = useState<MeetingDetailDTO | null>(null);
  const [summaryText, setSummaryText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0); // 현재 재생 시간
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const getMeetingDetail = async () => {
      if (projectId && meetingId) {
        try {
          const data = await fectchMeetingDetail(Number(projectId), Number(meetingId));
          setMeetingData(data);
        } catch (error) {
          console.error('Failed to fetch meeting details:', error);
        }
      }
    };

    getMeetingDetail();
  }, [projectId, meetingId]);

  if (!meetingData) return null;
  
  // AI 요약 API 호출 함수
  const handleAISummaryClick = async () => {
    if (projectId && meetingId) {
      setIsLoading(true); // 요청 시작 시 로딩 상태를 true로 설정
      try {
        const response = await createAISummary(Number(projectId), Number(meetingId));
        setSummaryText(response.meetingSummary); // 응답의 요약 텍스트를 summaryText에 저장
      } catch (error) {
        console.error('Failed to create AI summary:', error);
      } finally {
        setIsLoading(false); // 요청이 완료되면 로딩 상태를 false로 설정
      }
    }
  };

  // 화자 수정 모달 열기
  const handleEditSpeakerClick = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
  };

  // 화자 변경 API 호출 함수
  const handleSelectSpeaker = async (member: Speaker) => {
    if (!projectId || !meetingId || !selectedSpeaker) return;

    const requestBody = [
      {
        label: selectedSpeaker.label,
        name: member.name,
      },
    ];

    try {
      // editSpeakers API 호출
      const updatedData = await editSpeakers(Number(projectId), Number(meetingId), requestBody);
      console.log('Speaker updated:', updatedData);

      // meetingData 상태 업데이트 (변경된 발화자 정보 적용)
      setMeetingData((prevData) => {
        if (!prevData) return null;
        
        // meetingData의 sttResponseDto 속성의 speakers와 segments에서 해당 발화자 정보를 업데이트
        const updatedSegments = prevData.sttResponseDto.segments.map((segment) => 
          segment.speaker.label === selectedSpeaker.label
            ? { ...segment, speaker: { ...segment.speaker, name: member.name } }
            : segment
        );

        const updatedSpeakers = prevData.sttResponseDto.speakers.map((speaker) =>
          speaker.label === selectedSpeaker.label
            ? { ...speaker, name: member.name }
            : speaker
        );

        return {
          ...prevData,
          sttResponseDto: {
            ...prevData.sttResponseDto,
            segments: updatedSegments,
            speakers: updatedSpeakers,
          },
        };
      });
    } catch (error) {
      console.error('Failed to update speaker:', error);
    }

    closeModal();
  };

  // 재생 시간 업데이트 함수
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime * 1000); // 초 단위 시간 * 1000을 밀리초로 변환
    }
  };

  // 현재 재생 중인 segment인지 확인하는 함수
  const isActiveSegment = (start: number, end: number) => {
    return currentTime >= start && currentTime <= end;
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h3 className={styles.title}>{meetingData.meetingTitle}</h3>
          <div className={styles.meetingInfo}>
            <span className={styles.date}>{formatMeetingTime(meetingData.meetingCreateTime)}</span>
            <span className={styles.duration}>{formatMeetingDuration(meetingData.meetingVoiceTime)}</span>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.participants}>
            {meetingData.sttResponseDto.segments.map((segment, index) => (
              <div key={index} className={styles.participantBox}>
                <img src="profile.jpg" alt="profile" />
                <div className={styles.participantComment}>
                  <p
                    className={styles.participantName}
                    onClick={() => handleEditSpeakerClick(segment.speaker)}
                  >
                    {segment.speaker.name}
                  </p>
                  <p className={`${styles.comment} ${isActiveSegment(segment.start, segment.end) ? styles.highlight : ''}`}>
                    {segment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.voicePlay}>
            {meetingData.meetingVoiceUrl ? (
              <audio
                controls
                src={meetingData.meetingVoiceUrl}
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate} // 재생 시간이 변할 때마다 호출
              >
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p>음성 파일을 불러오는 중입니다.</p>
            )}
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <Button size="large" colorType="green" onClick={handleAISummaryClick}>
          🤖 AI 요약 확인하기
        </Button>
        {isLoading ? (
          <Loading />
        ) : (
          summaryText && (
            <div className={styles.summaryBox}>
              <h3>📑 요약 내용</h3>
              <div className={styles.summaryText}>
                {summaryText.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )
        )}
      </div>
      {selectedSpeaker && (
        <SelectSpeakerModal
          isOpen={isModalOpen}
          onClose={closeModal}
          projectId={Number(projectId)}
          onSelect={handleSelectSpeaker}
          selectedSpeaker={selectedSpeaker} // selectedSpeaker가 null이 아니므로 오류 발생하지 않음
        />
      )}
    </div>
  );
};

export default MeetingDetail;
