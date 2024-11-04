import React from 'react';
import styles from './TodoList.module.css';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { JiraDTO } from '../../../types/dashboard/WeeklyDataDTO';

interface TodoListItemProps {
  task: JiraDTO;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ task }) => {
  // console.log(task);
  return (
    <div className={styles.todoListItem}>
      <div>
        <span className={styles.taskEpic}>{task.epic}</span>
        <span className={styles.taskTitle}>{task.title}</span>
      </div>
      <span className={styles.taskPriority}>{task.priority}</span>
    </div>
  );
};

const TodoList: React.FC = () => {
  const { data: weeklyData } = useDashboardData();
  const todoList = weeklyData.todoList;
  if (!weeklyData || !weeklyData.todoList) {
    return <div>할 일이 없습니다.</div>;
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListHeader}>할 일</div>
      <div className={styles.todoListBody}>
        {todoList.length > 0 &&
          todoList.map((t) => {
            return <TodoListItem task={t as JiraDTO} />;
          })}
      </div>
    </div>
  );
};

export default TodoList;
