import styles from './Task.module.css';
import React from 'react';
import classNames from 'classnames';
import { TaskType } from '../../../types/dashboard/TaskTypes';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { useDashboardStore } from '../../../stores/useDashboardStore';
import { IssueDTO, TaskDTO } from '../../../types/dashboard/WeeklyDataDTO';

interface TaskProps {
  taskType: TaskType;
  day: DayOfWeek;
  tasks: TaskDTO[] | IssueDTO[];
}

const Task: React.FC<TaskProps> = ({ taskType, day, tasks }) => {
  const { taskStatus, toggleTask } = useDashboardStore();
  const isOpen = taskStatus[day][taskType]; // 현재 상태 가져오기
  
  const handleClick = () => {
    toggleTask(day, taskType); // 상태 토글
  };

  return (
    <>
      <div onClick={handleClick} className={classNames(styles.taskTitle, styles[`${taskType}-title`])}>
        {taskType} {isOpen ? '▼' : '►'}
      </div>
      {isOpen &&
        tasks.map((task, index) => (
          <div key={index} className={`${styles.task} ${styles[taskType]}`}>
            {taskType === 'jira' ? (task as IssueDTO).summary : (task as TaskDTO).title}
          </div>
        ))}
    </>
  );
};

export default Task;
