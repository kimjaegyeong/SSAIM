import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import moment from "moment";
import 'react-calendar/dist/Calendar.css';
import styles from './ProjectRemindPage.module.css';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import FilterHeader from '../../features/project/components/remind/FilterHeader';
import DayTeamRemind from '../../features/project/components/remind/DayTeamRemind';
import DayMyRemind from '../../features/project/components/remind/DayMyRemind';
import WeekRemind from '../../features/project/components/remind/WeekRemind';
import Button from '../../components/button/Button'


const ProjectRemindPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [dayWeek, setDayWeek] = useState('1일'); 
  const [myTeam, setMyTeam] = useState('나의 회고');

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <div className={styles.container}>
        <div className={styles.left}>
          <FilterHeader dayWeek={dayWeek} setDayWeek={setDayWeek} myTeam={myTeam} setMyTeam={setMyTeam} selectedDate={selectedDate}/>
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
            회고 작성하기
          </Button>
          <p className={styles.description}> 조회할 날짜를 선택해주세요 </p>
          <div className={styles.calendar}>
          <Calendar 
            onChange={(date) => setSelectedDate(date as Date)} 
            value={selectedDate} 
            formatDay={(_, date) => moment(date).format("D")} 
          />
          {/* {moment(selectedDate).format("YYYY년 MM월 DD일 (ddd)")} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectRemindPage;
