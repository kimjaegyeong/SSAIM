import styles from './Task.module.css';
import React from 'react';

interface TaskProps {
  title: string;
  taskType: 'Jira' | 'GitLab' | '회의록';
}

const Task: React.FC<TaskProps> = ({ title, taskType }) => {
  const getTaskClass = () => {
    switch (taskType) {
      case 'Jira':
        return styles.jira;
      case 'GitLab':
        return styles.gitlab;
      case '회의록':
        return styles.meeting;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.task} ${getTaskClass()}`}>
      {title}
    </div>
  );
};

export default Task;
