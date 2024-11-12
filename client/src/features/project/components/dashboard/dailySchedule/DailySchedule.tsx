import styles from './DailySchedule.module.css';
import React from 'react';
import Task from '../task/Task';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { useDashboardStore } from '../../../stores/useDashboardStore';
import { IssueDTO, GitlabDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
interface DailyScheduleProps {
  day: DayOfWeek;
  date: number;
  jiraData : IssueDTO[] | [];
  gitlabData : GitlabDTO[];
  meetingData : any[];

}

const DailySchedule: React.FC<DailyScheduleProps> = ({ day, date, jiraData, gitlabData }) => {
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
        {gitlabData?.length > 0 &&(
          <Task taskType="gitlab" day={day} tasks={gitlabData} />
        )}
        {weeklyData?.dailyData[dayIdx]?.meeting?.length > 0 && (
          <Task taskType="meeting" day={day} tasks={weeklyData?.dailyData[dayIdx].meeting} />
        )}
      </div>
    </div>
  );
};

export default DailySchedule;
