import WeeklySchedule from '../../features/project/components/dashboard/weeklySchedule/WeeklySchedule';
import DashboardHeader from '../../features/project/components/dashboard/dashboardHeader/DashboardHeader';
import ProgressChart from '../../features/project/components/dashboard/progressChart/ProgressChart';
import styles from './MainPage.module.css'
import TodoList from '../../features/project/components/dashboard/todoList/TodoList';
const MainPage = () => {
  return (
    <div className={styles.layout}>
      <DashboardHeader />
      <WeeklySchedule weeklyStartDate={new Date('2024-10-30')} />
      <div className={styles.dashboardBottom}>
      <ProgressChart/>
      <TodoList/>
      </div>
    </div>
  );
};

export default MainPage;
