import styles from './DailySchedule.module.css';
import React from 'react';
import Task from '../task/Task';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { useWeeklyData } from '../../../hooks/useWeeklyData';

interface DailyScheduleProps {
  day: DayOfWeek;
  date: number;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ day, date }) => {
  const { data: weeklyData } = useWeeklyData();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {day}, {date}
      </div>
      <div className={styles.content}>
        {weeklyData?.dailyData[day]?.jira?.length > 0 && <Task taskType="jira" day={day} />}
        {weeklyData?.dailyData[day]?.gitlab?.length > 0 && <Task taskType="gitlab" day={day} />}
        {weeklyData?.dailyData[day]?.meeting?.length > 0 && <Task taskType="meeting" day={day} />}
      </div>
    </div>
  );
};

export default DailySchedule;
