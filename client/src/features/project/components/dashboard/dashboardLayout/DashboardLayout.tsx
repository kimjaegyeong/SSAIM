// 하위 컴포넌트
import WeeklySchedule from '@features/project/components/dashboard/weeklySchedule/WeeklySchedule';
import DashboardHeader from '@features/project/components/dashboard/dashboardHeader/DashboardHeader';
import TodoList from '@features/project/components/dashboard/todoList/TodoList';
// css Module
import styles from './DashboardLayout.module.css';
// types
import useUserStore from '@/stores/useUserStore';
import { useDashboardStore } from '@/features/project/stores/useDashboardStore';
import { useProjectListData } from '@/features/project/hooks/useProjectListData';

export const DashboardButtonGrid: React.FC<{ linkMap: Record<string, string> }> = ({ linkMap }) => {
  return (
    <div className={styles.buttonGrid}>
      {['Jira', 'Gitlab', 'Figma', 'Notion'].map((label) => (
        <div
          className={styles.gridButton}
          onClick={() => {
            window.open(linkMap[label]);
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

const DashboardLayout = () => {
  const { userId } = useUserStore();
  const { projectId } = useDashboardStore();
  const { data: projectListData } = useProjectListData(userId);
  const projectInfo = projectListData?.find((p) => p.id === projectId);
  console.log(projectInfo);
  const tempLink: Record<string, string> = {
    Jira: 'http://www.naver.com',
    Gitlab: 'http://www.naver.com',
    Figma: 'http://www.naver.com',
    Notion: 'http://www.naver.com',
  };
  return (
    <div className={styles.layout}>
      <DashboardHeader />
      <WeeklySchedule weeklyStartDate={new Date('2024-10-30')} />
      <div className={styles.dashboardBottom}>
        <div className={styles.chartContainer}>
          <DashboardButtonGrid linkMap={tempLink} />
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default DashboardLayout;
