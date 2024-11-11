import styles from './DailySchedule.module.css';
import React from 'react';
import Task from '../task/Task';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { useDashboardStore } from '../../../stores/useDashboardStore';
import { IssueDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
interface DailyScheduleProps {
  day: DayOfWeek;
  date: number;
  jiraData : IssueDTO[] | [];
  gitlabData : any[];
  meetingData : any[];

}

const DailySchedule: React.FC<DailyScheduleProps> = ({ day, date, jiraData }) => {
  const { weekdayIndex } = useDashboardStore();
  const { data: weeklyData } = useDashboardData();
  const dayIdx = weekdayIndex[day];
  console.log(jiraData)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {day}, {date}
      </div>
      <div className={styles.content}>
        {jiraData?.length > 0 && (
          <Task taskType="jira" day={day} tasks={jiraData} />
        )}
        {weeklyData?.dailyData[dayIdx]?.gitlab?.length > 0 && (
          <Task taskType="gitlab" day={day} tasks={weeklyData?.dailyData[dayIdx].gitlab} />
        )}
        {weeklyData?.dailyData[dayIdx]?.meeting?.length > 0 && (
          <Task taskType="meeting" day={day} tasks={weeklyData?.dailyData[dayIdx].meeting} />
        )}
      </div>
    </div>
  );
};

export default DailySchedule;
