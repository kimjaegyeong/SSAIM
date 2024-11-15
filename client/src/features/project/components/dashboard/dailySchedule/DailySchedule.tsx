import styles from './DailySchedule.module.css';
import React from 'react';
import Task from '../task/Task';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { IssueDTO, GitlabDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
import { MeetingItemDTO } from '@/features/project/types/meeting/MeetingDTO';

interface DailyScheduleProps {
  day: DayOfWeek;
  date: number;
  jiraData: IssueDTO[] | [];
  gitlabData: GitlabDTO[];
  meetingData: MeetingItemDTO[];
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ day, date, jiraData, gitlabData, meetingData }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {day}, {date}
      </div>
      <div className={styles.content}>
        {jiraData?.length > 0 && <Task taskType="jira" day={day} tasks={jiraData} />}
        {gitlabData?.length > 0 && <Task taskType="gitlab" day={day} tasks={gitlabData} />}
        {meetingData?.length > 0 && <Task taskType="meeting" day={day} tasks={meetingData} />}
      </div>
    </div>
  );
};

export default DailySchedule;
