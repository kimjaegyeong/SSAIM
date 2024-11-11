import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MeetingDetail.module.css';
import Button from '../../../../components/button/Button';
import { fectchMeetingDetail } from '../../apis/meeting/fectchMeetingDetail';
import { createAISummary } from '../../apis/meeting/createAISummary';
import { MeetingDetailDTO } from '../../types/meeting/MeetingDTO';
import {formatMeetingTime, formatMeetingDuration} from '../../utils/meetingTime';
import Loading from '@/components/loading/Loading';


const MeetingDetail = () => {
  const { projectId, meetingId } = useParams<{ projectId: string, meetingId: string }>();
  const [meetingData, setMeetingData] = useState<MeetingDetailDTO| null>(null);
  const [summaryText, setSummaryText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // 화자 수정 API 호출 함수
  const EditSpeckerClick = async () => {

  }


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
            {meetingData.sttResponseDto.segments.map((segment, index: number) => (
              <div key={index} className={styles.participantBox}>
                <img src="profile.jpg"alt="profile" />
                <div className={styles.participantComment}>
                  <p className={styles.participantName} onClick={EditSpeckerClick}>{segment.speaker.name}</p>
                  <p className={styles.comment}>{segment.text}</p>
                </div>
              </div>
            ))}
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
          summaryText && ( // summaryText가 있을 때만 렌더링
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
    </div>
  );
};

export default MeetingDetail;
