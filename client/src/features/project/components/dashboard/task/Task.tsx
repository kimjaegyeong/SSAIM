import styles from './Task.module.css';
import React from 'react';
import classNames from 'classnames';
import { TaskType } from '../../../types/dashboard/TaskTypes';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { useWeeklyData } from '../../../hooks/useWeeklyData';

interface TaskProps {
  taskType: TaskType;
  day: DayOfWeek;
}

const Task: React.FC<TaskProps> = ({ taskType, day }) => {
  const { taskStatus, toggleTask } = useDashboardStore();
  const { data: weeklyData } = useWeeklyData(); 
  const isOpen = taskStatus[day][taskType]; // 현재 상태 가져오기
  const tasks = weeklyData?.dailyData[day][`${taskType}`]; // 각 요일에 맞는 작업 가져오기
  const handleClick = () => {
    toggleTask(day, taskType); // 상태 토글
  };
  return (
    <>
      <div onClick={handleClick} className={classNames(styles.taskTitle, styles[`${taskType}-title`])}>
        {taskType} {isOpen ? '▼' : '►'}
      </div>
      {isOpen&&
      tasks.map((e) => {
        return <div className={`${styles.task} ${styles[taskType]}`}>{e.title}</div>;
      })}
    </>
  );
};

export default Task;
