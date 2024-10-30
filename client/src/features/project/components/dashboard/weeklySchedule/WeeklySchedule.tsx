import DailySchedule from '../dailySchedule/DailySchedule';
import styles from './WeeklySchedule.module.css';
import React from 'react';

interface WeeklyScheduleProps {
  weeklyStartDate: Date;
}
type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
const weekDays: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ weeklyStartDate }) => {
  const year = weeklyStartDate.getFullYear();
  const month = weeklyStartDate.getMonth();
  const day = weeklyStartDate.getDate();
  const weekMap = {
    Monday: { date: weeklyStartDate },
    Tuesday: { date: new Date(year, month, day + 1) },
    Wednesday: { date: new Date(year, month, day + 2) },
    Thursday: { date: new Date(year, month, day + 3) },
    Friday: { date: new Date(year, month, day + 4) },
    Saturday: { date: new Date(year, month, day + 5) },
    Sunday: { date: new Date(year, month, day + 6) },
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>header</div> */}
      <div className={styles.content}>
        {weekDays.map((e) => {
          console.log(typeof e);
          console.log(e);
          return <DailySchedule date={weekMap[e]?.date.getDate()} day={e} />;
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
