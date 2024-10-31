import WeeklySchedule from '../../features/project/components/dashboard/weeklySchedule/WeeklySchedule';

const MainPage = () => {
  return (
    <>
      <WeeklySchedule weeklyStartDate={new Date("2024-10-30")} />
    </>
  );
};

export default MainPage;
