import DailySchedule from '../dailySchedule/DailySchedule';
import styles from './WeeklySchedule.module.css';
import React from 'react';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
interface WeeklyScheduleProps {
  weeklyStartDate: Date;
}

const weekDays: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];
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
      <div className={styles.content}>
        {weekDays.map((e, i) => {
          return <DailySchedule key={i} date={weekMap[e]?.date.getDate()} day={e} />;
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
