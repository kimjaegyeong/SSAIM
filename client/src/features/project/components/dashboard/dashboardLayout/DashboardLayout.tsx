// 하위 컴포넌트
import WeeklySchedule from '@features/project/components/dashboard/weeklySchedule/WeeklySchedule';
import DashboardHeader from '@features/project/components/dashboard/dashboardHeader/DashboardHeader';
import ProgressChart from '@features/project/components/dashboard/progressChart/ProgressChart';
import TodoList from '@features/project/components/dashboard/todoList/TodoList';
// css Module
import styles from './DashboardLayout.module.css';
// types

const DashboardLayout = () => {
  return (
    <div className={styles.layout}>
      <DashboardHeader />
      <WeeklySchedule weeklyStartDate={new Date('2024-10-30')} />
      <div className={styles.dashboardBottom}>
        <div className={styles.chartContainer}>
          <ProgressChart />
        </div>
        <TodoList />
      </div>
    </div>
  );
};

export default DashboardLayout;
