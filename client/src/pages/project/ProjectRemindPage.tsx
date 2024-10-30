import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import styles from './ProjectRemindPage.module.css';
import FilterHeader from '../../features/project/components/remind/FilterHeader';
import DayTeamRemind from '../../features/project/components/remind/DayTeamRemind';

const ProjectRemindPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [dayWeek, setDayWeek] = useState('1일'); 
  const [myTeam, setMyTeam] = useState('나의 회고');

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <div className={styles.container}>
        <div className={styles.left}>
            <FilterHeader dayWeek={dayWeek} setDayWeek={setDayWeek} myTeam={myTeam} setMyTeam={setMyTeam} />
            <div className={styles.remindContent}>
                {dayWeek === '1일' && myTeam === '나의 회고' && <p>1일 동안의 나의 회고 내용</p>}
                {dayWeek === '1일' && myTeam === '팀원 회고' && <DayTeamRemind />}
                {dayWeek === '1주일' && myTeam === '나의 회고' && <p>1주일 동안의 나의 회고 내용</p>}
                {dayWeek === '1주일' && myTeam === '팀원 회고' && <p>1주일 동안의 팀원 회고 내용</p>}
            </div>
        </div>
        <div className={styles.right}>
        </div>
      </div>
    </div>
  );
};

export default ProjectRemindPage;
