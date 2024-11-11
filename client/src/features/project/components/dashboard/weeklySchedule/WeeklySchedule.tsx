import DailySchedule from '../dailySchedule/DailySchedule';
import styles from './WeeklySchedule.module.css';
import React, { useMemo } from 'react';
import { DayOfWeek } from '../../../types/dashboard/DayOfWeek';
import { useDashboardStore } from '@/features/project/stores/useDashboardStore';
import { useSprintIssueQuery } from '@/features/project/hooks/useSprintIssueData';
import useUserStore from '@/stores/useUserStore';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
import { dateToString } from '@/utils/dateToString';
import { IssueDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
interface WeeklyScheduleProps {
  weeklyStartDate: Date;
}

const weekDays: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

const WeeklySchedule: React.FC<WeeklyScheduleProps> = () => {
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(userId);

  const { projectId, projectWeekList, currentWeek } = useDashboardStore();
  const startDate = projectWeekList?.[currentWeek]?.startDate;
  const endDate = projectWeekList?.[currentWeek]?.endDate;
  const year = endDate?.getFullYear();
  const month = endDate?.getMonth();
  const day = endDate?.getDate();
  const userName = userInfo?.userName;
  console.log(userName)
  const { data: sprintIssues } = useSprintIssueQuery(
    projectId,
    dateToString(startDate, '-'),
    dateToString(endDate, '-')
  );
  const filterdIssues = sprintIssues?.filter((issue:IssueDTO)=>{return issue.allocator === userName})
  const weekMap = {
    Monday: { date: new Date(year, month, day - 3) },
    Tuesday: { date: new Date(year, month, day - 2) },
    Wednesday: { date: new Date(year, month, day - 1) },
    Thursday: { date: endDate },
    Friday: { date: new Date(year, month, day + 1) },
    Saturday: { date: new Date(year, month, day + 2) },
    Sunday: { date: new Date(year, month, day + 3) },
  };

  // `sprintIssues` 데이터를 요일별로 분류하는 로직
  const dashboardData = useMemo(() => {
    const dataByDay: {
      [key in DayOfWeek]: { jira: IssueDTO[]; gitlab: any[]; meeting: any[] };
    } = {
      Monday: { jira: [], gitlab: [], meeting: [] },
      Tuesday: { jira: [], gitlab: [], meeting: [] },
      Wednesday: { jira: [], gitlab: [], meeting: [] },
      Thursday: { jira: [], gitlab: [], meeting: [] },
      Friday: { jira: [], gitlab: [], meeting: [] },
      Saturday: { jira: [], gitlab: [], meeting: [] },
      Sunday: { jira: [], gitlab: [], meeting: [] },
    };

    filterdIssues?.forEach((issue:IssueDTO) => {
      const match = issue.title.match(/(\d{6})/); // `title`에서 날짜 추출
      if (match) {
        const dateStr = match[0];
        const year = 2000 + parseInt(dateStr.slice(0, 2), 10);
        const month = parseInt(dateStr.slice(2, 4), 10) - 1;
        const date = parseInt(dateStr.slice(4, 6), 10);
        const dateObj = new Date(year, month, date);

        const dayOfWeek = dateObj.getDay(); // 요일 인덱스 계산 (0=일요일, 1=월요일, ...)
        const weekDay = weekDays[dayOfWeek - 1] || '날짜미지정';

        dataByDay[weekDay as DayOfWeek].jira.push(issue);
      } else {
        // dataByDay['날짜미지정']?.jira.push(issue); // 날짜가 없을 경우 '날짜미지정' 처리
      }
    });

    return dataByDay;
  }, [sprintIssues]);
  console.log(sprintIssues);
  console.log(dashboardData);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {weekDays.map((day, i) => (
          <DailySchedule
            key={i}
            date={weekMap[day]?.date?.getDate()}
            day={day}
            jiraData={dashboardData[day]?.jira}
            gitlabData={dashboardData[day]?.gitlab}
            meetingData={dashboardData[day]?.meeting}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
