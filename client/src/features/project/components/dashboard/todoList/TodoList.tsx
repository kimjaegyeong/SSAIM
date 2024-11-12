import React, { useEffect, useState } from 'react';
import styles from './TodoList.module.css';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { IssueDTO } from '../../../types/dashboard/WeeklyDataDTO';
import { useSprintIssueQuery } from '@/features/project/hooks/useSprintIssueData';
import { useDashboardStore } from '@/features/project/stores/useDashboardStore';
import { dateToString } from '@/utils/dateToString';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
import useUserStore from '@/stores/useUserStore';
interface TodoListItemProps {
  task: IssueDTO;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ task }) => {
  // console.log(task);
  return (
    <div className={styles.todoListItem}>
      <div>
        <span className={styles.taskEpic}>{task.epicCode}</span>
        <span className={styles.taskTitle}>{task.title}</span>
      </div>
      <span className={styles.taskPriority}>{task.storyPoint}</span>
    </div>
  );
};

const TodoList: React.FC = () => {
  const { userId } = useUserStore();
  const { projectId, projectWeekList } = useDashboardStore();
  const { data: weeklyData } = useDashboardData();
  const {data : userInfo} = useUserInfoData(userId);
  const [latestWeekIdx, setLatestWeekIdx] = useState(0);
  const userName = userInfo?.userName
  useEffect(() => {
    if (projectWeekList && projectWeekList.length > 0) {
      let flag = 0;
      for (let i = 0; i < projectWeekList.length; i++) {
        const year = projectWeekList[i].endDate.getFullYear();
        const month = projectWeekList[i].endDate.getMonth();
        const day = projectWeekList[i].endDate.getDate();
        if (new Date(year, month, day - 3) <= new Date() && new Date() <= new Date(year, month, day + 3)) {
          flag = 1;
          setLatestWeekIdx(i);
          break;
        }
      }
      if (!flag) {
        setLatestWeekIdx(projectWeekList.length - 1);
      }
    }
  }, [projectWeekList]);
  const { data: sprintIssues } = useSprintIssueQuery(
    projectId,
    dateToString(projectWeekList[latestWeekIdx]?.startDate, '-'),
    dateToString(projectWeekList[latestWeekIdx]?.endDate, '-')
  );

  const todoList = sprintIssues?.filter((issue: IssueDTO) => issue.progress !== '완료').filter((issue: IssueDTO) => issue.allocator === userName);
  if (!weeklyData || !weeklyData?.todoList) {
    return <div>할 일이 없습니다.</div>;
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListHeader}>할 일</div>
      <div className={styles.todoListBody}>
        {todoList?.length > 0 &&
          todoList.map((t: IssueDTO, i:number) => {
            return <TodoListItem task={t} key={i}/>;
          })}
      </div>
    </div>
  );
};

export default TodoList;
