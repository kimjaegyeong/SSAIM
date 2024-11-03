import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './MeetingList.module.css';
import Button from '../../../../components/button/Button';
import MeetingCalendar from './MeetingCalendar';
import MeetingItem from './MeetingItem';
import { Meeting } from '../../types/meeting/Meeting';
import MeetingModal from './MeetingModal';



const MeetingList = () => {
  const navigate = useNavigate();

  const { projectId } = useParams<{ projectId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: '팀 미팅',
      description: '저희 산출물 먼저 보여드리겠습니다.',
      date: '10.21 (월) 오후 4:00',
      duration: '52분'
    },
    {
      id: '2',
      title: '아이디어 구체화',
      description: '저희 아이디어 구체화 좀 해볼까요?',
      date: '10.21 (월) 오후 2:21',
      duration: '48분'
    },
    {
      id: '3',
      title: '레전드 아이디어 회의',
      description: '여러분 일단 막 뱉어봅시다.',
      date: '10.18 (금) 오전 10:39',
      duration: '121분'
    },
    {
      id: '4',
      title: '필드트립 회식 선정 회의',
      description: '혹시 못 먹는거 있는 사람 ?',
      date: '10.17 (목) 오후 5:16',
      duration: '24분'
    },
    {
      id: '5',
      title: '아이디어 브레인스토밍',
      description: '꼭 해보고 싶은 기술 있나요?',
      date: '10.17 (목) 오후 3:47',
      duration: '69분'
    },
    {
      id: '6',
      title: '팀명 선정 회의',
      description: '다들 특화 때 팀 이름이 뭐였나요?',
      date: '10.15 (화) 오전 11:56',
      duration: '17분'
    }
  ]);

  const handleMeetingClick = (meeting: Meeting) => {
    console.log('Selected meeting:', meeting);
    navigate(`/project/${projectId}/meeting/${meeting.id}`, {
      state: {
        title: meeting.title,
        date: meeting.date,
        duration: meeting.duration
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
              key={meeting.id}
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