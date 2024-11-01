import { useState } from 'react';
import styles from './SprintContainer.module.css';
import FilterHeader from './FilterHeader';
import Button from '../../../../../components/button/Button';
import WeekCalendar from './WeekCalendar'
import MySprint from './my/MySprint';


const SprintContainer = () => {
    const [myTeam, setMyTeam] = useState('나의 회고');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    const formattedDate = new Intl.DateTimeFormat('ko', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }).format(selectedDate).replace(/ (\S+)$/, ' ($1)');
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
          {myTeam === '팀원 회고' && <p>팀원 회고 입니둥</p>}
        </div>
        
      </div>
      <div className={styles.right}>
        <Button size="large" colorType="purple">
          🚀 주간 회고 생성
        </Button>
        <p className={styles.description}>조회할 날짜를 선택해주세요</p>
        <WeekCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>
    </div>
  );
};

export default SprintContainer;