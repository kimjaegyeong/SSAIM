import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectHeader from '../../features/project/components/ProjectHeader';
import styles from './ProjectRemindPage.module.css';
import { FaRegClock } from "react-icons/fa6"

const ProjectRemindPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [dayWeek, setDayWeek] = useState('1일'); // '1일' 또는 '1주일' 선택
  const [myTeam, setMyTeam] = useState('나의 회고');

  return (
    <div>
      <ProjectHeader projectId={projectId as string} />
      <div className={styles.container}>
        <div className={styles.left}>
            <div className={styles.filterHeader}>
                <div className={styles.dateTitle}>
                    <FaRegClock style={{ strokeWidth: 4,  color:"#007bff" }}/>
                    2024년 10월 30일 (수)
                </div>
                <div className={styles.filter}>
                    <div className={styles.dayWeek}>
                        <div onClick={() => setDayWeek('1일')} className={dayWeek === '1일' ? styles.active : ''}>1일</div>
                        <div onClick={() => setDayWeek('1주일')} className={dayWeek === '1주일' ? styles.active : ''}>1주일</div>
                    </div>
                    <div className={styles.myTeam}>
                        <div onClick={() => setMyTeam('나의 회고')} className={myTeam === '나의 회고' ? styles.active : ''}>나의 회고</div>
                        <div onClick={() => setMyTeam('팀원 회고')} className={myTeam === '팀원 회고' ? styles.active : ''}>팀원 회고</div>
                    </div>
                </div>
            </div>
            <div className={styles.remindContent}>
                {dayWeek === '1일' && myTeam === '나의 회고' && <p>1일 동안의 나의 회고 내용</p>}
                {dayWeek === '1일' && myTeam === '팀원 회고' && <p>1일 동안의 팀원 회고 내용</p>}
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
