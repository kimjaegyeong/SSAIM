// 하위 컴포넌트
import WeeklySchedule from '@features/project/components/dashboard/weeklySchedule/WeeklySchedule';
import DashboardHeader from '@features/project/components/dashboard/dashboardHeader/DashboardHeader';
import ProgressChart from '@features/project/components/dashboard/progressChart/ProgressChart';
import TodoList from '@features/project/components/dashboard/todoList/TodoList';
// css Module
import styles from './DashboardLayout.module.css';
// types
import useUserStore from '@/stores/useUserStore';
import { useDashboardStore } from '@/features/project/stores/useDashboardStore';
import { useProjectListData } from '@/features/project/hooks/useProjectListData';

const DashboardLayout = () => {
  const { userId } = useUserStore();
  const { projectId } = useDashboardStore();
  const { data: projectListData } = useProjectListData(userId);
  const projectInfo = projectListData?.find(p=>p.id === projectId)
  const chartsData = [
    { label: 'Backend', progress: projectInfo?.progressBack || 0 },
    { label: 'Frontend', progress: projectInfo?.progressFront || 0 },
  ]
  return (
    <div className={styles.layout}>
      <DashboardHeader />
      <WeeklySchedule weeklyStartDate={new Date('2024-10-30')} />
      <div className={styles.dashboardBottom}>
        <div className={styles.chartContainer}>
          <ProgressChart chartsData={chartsData}/>
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default DashboardLayout;
