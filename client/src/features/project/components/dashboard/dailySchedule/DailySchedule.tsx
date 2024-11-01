import styles from './DailySchedule.module.css';
import React from 'react';
import Task from '../task/Task';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { useDashboardStore } from '../../../stores/dashboardStore';

interface DailyScheduleProps {
  day: DayOfWeek;
  date: number;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ day, date }) => {
  const { data: weeklyData } = useDashboardData();
  const{weekdayIndex} = useDashboardStore();
  const dayIdx = weekdayIndex[day];
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {day}, {date}
      </div>
      <div className={styles.content}>
        
        {weeklyData?.dailyData[dayIdx]?.jira?.length > 0 && <Task taskType="jira" day={day} tasks={weeklyData?.dailyData[dayIdx].jira}/>}
        {weeklyData?.dailyData[dayIdx]?.gitlab?.length > 0 && <Task taskType="gitlab" day={day} tasks={weeklyData?.dailyData[dayIdx].gitlab}/>}
        {weeklyData?.dailyData[dayIdx]?.meeting?.length > 0 && <Task taskType="meeting" day={day} tasks={weeklyData?.dailyData[dayIdx].meeting}/>}
      </div>
    </div>
  );
};  

export default DailySchedule;
