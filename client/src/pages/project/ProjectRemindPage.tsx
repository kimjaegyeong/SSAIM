import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProjectRemindPage.module.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from "moment";
import 'moment/locale/ko';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import FilterHeader from '../../features/project/components/remind/FilterHeader';
import DayTeamRemind from '../../features/project/components/remind/DayTeamRemind';
import DayMyRemind from '../../features/project/components/remind/DayMyRemind';
import WeekRemind from '../../features/project/components/remind/WeekRemind';
import Button from '../../components/button/Button'

moment.locale('ko');

const ProjectRemindPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [dayWeek, setDayWeek] = useState('1일'); 
  const [myTeam, setMyTeam] = useState('나의 회고');

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formattedDate = new Intl.DateTimeFormat('ko', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  }).format(selectedDate).replace(/ (\S+)$/, ' ($1)');

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <div className={styles.container}>
        <div className={styles.left}>
          <FilterHeader dayWeek={dayWeek} setDayWeek={setDayWeek} myTeam={myTeam} setMyTeam={setMyTeam} formattedDate={formattedDate}/>
          <div className={styles.remindContent}>
              {dayWeek === '1일' && myTeam === '나의 회고' && <DayMyRemind/>}
              {dayWeek === '1일' && myTeam === '팀원 회고' && <DayTeamRemind />}
              {dayWeek === '1주일' && myTeam === '나의 회고' && <WeekRemind/>}
              {dayWeek === '1주일' && myTeam === '팀원 회고' && <WeekRemind/>}
          </div>
        </div>
        <div className={styles.right}>
          <Button 
              size="large" 
              colorType="blue" 
          > 
            📝 회고 작성하기
          </Button>
          <p className={styles.description}> 조회할 날짜를 선택해주세요 </p>
          <div className={styles.calendar}>
          <Calendar 
            onChange={(date) => setSelectedDate(date as Date)} 
            value={selectedDate} 
            formatDay={(_, date) => moment(date).format("D")} 
            formatYear={(_, date) => moment(date).format("YYYY")}
            calendarType="gregory"
            showNeighboringMonth={false}
            next2Label={null} 
            prev2Label={null} 
            minDetail="year"
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRemindPage;
