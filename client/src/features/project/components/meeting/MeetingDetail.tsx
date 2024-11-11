import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MeetingDetail.module.css';
import Button from '../../../../components/button/Button';
import { fectchMeetingDetail } from '../../apis/meeting/fectchMeetingDetail';
import { MeetingDetailDTO } from '../../types/meeting/MeetingDTO';
import {formatMeetingTime, formatMeetingDuration} from '../../utils/meetingTime';


const MeetingDetail = () => {
  const { projectId, meetingId } = useParams<{ projectId: string, meetingId: string }>();
  const [meetingData, setMeetingData] = useState<MeetingDetailDTO| null>(null);

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

  const summaryText = `1. 프로젝트 관리\n- 관리자/사용자 그룹 생성 및 그룹장 설정 기능 추가.\n
- 팀장 권한으로 JIRA, Gitlab 연동 가능.\n
- 스프린트 자동 생성 및 이슈 완료 알림 기능 포함.\n
- API 및 기능 명세서 템플릿 제공 결정.\n
2. 회고\n- 일일 회고 자동 작성 (회의록 기반), 주간 회고 자동 생성.\n
- 주간 회고를 바탕으로 '우리가 함께 만드는 개발 이야기' 생성 기능 추가.`;


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
                  <p className={styles.participantName}>{segment.speaker.name}</p>
                  <p className={styles.comment}>{segment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <div className={styles.right}>
        <Button size="large" colorType="green">
          🤖 AI 요약 확인하기
        </Button>
        <div className={styles.summaryBox}>
          <h3>요약 내용</h3>
          <div className={styles.summaryText}>
            {summaryText.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetail;
