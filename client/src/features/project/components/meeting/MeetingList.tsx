import { useState, useEffect  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './MeetingList.module.css';
import Button from '../../../../components/button/Button';
import MeetingCalendar from './MeetingCalendar';
import MeetingItem from './MeetingItem';
import MeetingModal from './MeetingModal';
import { fetchMeetingList } from '@features/project/apis/meeting/fetchMeetingList';
import { MeetingItemDTO } from '../../types/meeting/MeetingDTO';
import {formatMeetingTime, formatMeetingDuration} from '../../utils/meetingTime';


const MeetingList = () => {
  const navigate = useNavigate();

  const { projectId } = useParams<{ projectId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetings, setMeetings] = useState<MeetingItemDTO[]>([]);



  useEffect(() => {
    const getMeetings = async () => {
      try {
        const data = await fetchMeetingList(Number(projectId)); // projectId를 숫자로 변환해서 API 호출
        console.log('Fetched meetings:', data); // API 결과 출력
        setMeetings(data); // meetings 상태에 데이터 저장
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    if (projectId) {
      getMeetings(); // projectId가 있을 때만 호출
    }
  }, [projectId]);


  const handleMeetingClick = (meeting: MeetingItemDTO) => {
    console.log('Selected meeting:', meeting);
    navigate(`/project/${projectId}/meeting/${meeting.meetingId}`, {
      state: {
        title: meeting.meetingTitle,
        date: formatMeetingTime(meeting.meetingCreateTime),
        duration: formatMeetingDuration(meeting.meetingVoiceTime)
      }
    });
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.meetingList}>
          {meetings.map((meeting) => (
            <MeetingItem
              key={meeting.meetingId}
              meeting={meeting}
              onClick={handleMeetingClick}
            />
          ))}
        </div>
        
      </div>
      <div className={styles.right}>
        <Button size="large" colorType="green" onClick={handleOpenModal}>
          🎙️ 회의록 생성하기
        </Button>
        <p className={styles.description}>조회할 날짜를 선택해주세요</p>
        <MeetingCalendar />
      </div>

      <MeetingModal isOpen={isModalOpen} onClose={handleCloseModal}>

      </MeetingModal>
    </div>
  );
};

export default MeetingList;