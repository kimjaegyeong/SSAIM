import { useState, useEffect  } from 'react';
import styles from './SprintContainer.module.css';
import FilterHeader from './FilterHeader';
import Button from '../../../../../components/button/Button';
import WeekCalendar from './WeekCalendar'
import MySprint from './my/MySprint';
import TeamSprint from './team/TeamSprint';
import SprintModal from './SprintModal';
import moment from 'moment';


const SprintContainer = () => {
    const [myTeam, setMyTeam] = useState('나의 회고');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');
    
    useEffect(() => {
      const month = moment(selectedDate).format('M'); // 현재 선택된 월
      const year = moment(selectedDate).format('YYYY'); // 현재 선택된 연도
      const startOfMonth = moment(selectedDate).startOf('month'); // 선택한 날짜의 월 시작일
      const weekNumber = Math.ceil((selectedDate.getDate() + startOfMonth.day()) / 7); // 주차 계산
      setFormattedDate(`${year}년 ${month}월 ${weekNumber}주차`); // 원하는 형식으로 포맷팅
  }, [selectedDate]);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <FilterHeader
            myTeam={myTeam}
            setMyTeam={setMyTeam}
            formattedDate={formattedDate}
        />
        <div className={styles.remindContent}>
          {myTeam === '나의 회고' && <MySprint />}
          {myTeam === '팀원 회고' && <TeamSprint/>}
        </div>
        
      </div>
      <div className={styles.right}>
        <Button size="large" colorType="purple" onClick={handleOpenModal}>
          🚀 주간 회고 생성
        </Button>
        <p className={styles.description}>조회할 날짜를 선택해주세요</p>
        <WeekCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <SprintModal isOpen={isModalOpen} onClose={handleCloseModal}>

      </SprintModal>
    </div>
  );
};

export default SprintContainer;