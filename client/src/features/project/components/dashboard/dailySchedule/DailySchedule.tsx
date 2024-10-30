import styles from './DailySchedule.module.css';
import React from 'react';
import classNames from 'classnames'; // classnames 라이브러리 불러오기
import Task from '../task/Task';

interface DailyScheduleProps {
  day: string;
  date: number;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ day, date }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          {day}, {date}
        </div>
        <div className={styles.content}>
          {/* 컨텐츠 타이틀 */}
          <div className={classNames(styles.taskTitle, styles.jira)}>Jira</div>
          <Task title="Jira task" taskType="Jira" />
          <div className={classNames(styles.taskTitle, styles.gitlab)}>GitLab</div>
          <Task title="GitLab task" taskType="GitLab" />
          <div className={classNames(styles.taskTitle, styles.meeting)}>회의록</div>
          <Task title="회의록 제목" taskType="회의록" />
        </div>
      </div>
    </>
  );
};

export default DailySchedule;
