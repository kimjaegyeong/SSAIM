import styles from './Sprint.module.css';
import Issue from './Issue';
import Button from '../../../../components/button/Button';
import { useState, useMemo } from 'react';
import SprintCreateModal from './SprintCreateModal';
import { useSprintIssueQuery } from '../../hooks/useSprintIssueData';
import { useProjectInfo } from '../../hooks/useProjectInfo';
import { useParams } from 'react-router-dom';
import calculateWeeks from '../../utils/calculateWeeks';
import { dateToString } from '@/utils/dateToString';

const WeeklyProgress = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projectInfo } = useProjectInfo(Number(projectId));
  const projectWeekList = calculateWeeks(
    new Date(projectInfo.startDate as Date),
    new Date(projectInfo.endDate as Date)
  );

  const [currentWeek, setCurrentWeek] = useState(0);
  useMemo(() => {
    setCurrentWeek(projectWeekList.length - 1);
  }, [projectWeekList.length]);
  const { data: sprintIssues } = useSprintIssueQuery(
    Number(projectId),
    dateToString(projectWeekList[currentWeek - 1]?.startDate, '-'),
    dateToString(projectWeekList[currentWeek - 1]?.endDate, '-')
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleIncreaseWeek = () => {
    if (currentWeek < projectWeekList.length - 1) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const handleDecreaseWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  // 요일 매핑 테이블 생성 (예: 월, 화, 수, 목, 금)

  const dayMap: Array<'월' | '화' | '수' | '목' | '금' | '날짜미지정'> = ['월', '화', '수', '목', '금', '날짜미지정'];
  const dateMap: Record<'월' | '화' | '수' | '목' | '금' | '날짜미지정', number | undefined> = useMemo(() => {
    if (!projectWeekList[currentWeek - 1]) return {
      월: undefined, 화: undefined, 수: undefined, 목: undefined, 금: undefined, 날짜미지정: undefined,
    };
  
    const endDate = new Date(projectWeekList[currentWeek - 1].endDate);
  
    return {
      금: endDate.getDate(),
      목: new Date(endDate.setDate(endDate.getDate() - 1)).getDate(),
      수: new Date(endDate.setDate(endDate.getDate() - 2)).getDate(),
      화: new Date(endDate.setDate(endDate.getDate() - 3)).getDate(),
      월: new Date(endDate.setDate(endDate.getDate() - 4)).getDate(),
      날짜미지정: undefined,
    };
  }, [projectWeekList, currentWeek]);
    console.log(dateMap);
  // 요일별로 sprintIssues를 분류
  const issuesByDay = useMemo(() => {
    const dayIssueMap: Record<string, any[]> = {
      월: [],
      화: [],
      수: [],
      목: [],
      금: [],
      날짜미지정: [],
    };

    sprintIssues?.forEach((issue: any) => {
      const match = issue.title.match(/(\d{6})/);
      let day = '날짜 미지정';

      if (match) {
        const dateStr = match[0];
        const year = 2000 + parseInt(dateStr.slice(0, 2), 10);
        const month = parseInt(dateStr.slice(2, 4), 10) - 1;
        const date = parseInt(dateStr.slice(4, 6), 10);

        const dateObj = new Date(year, month, date);
        const daysOfWeek = ['일요일', '월', '화', '수', '목', '금', '토'];
        const weekday = daysOfWeek[dateObj.getDay()];

        // 요일이 월~금에 해당하는 경우에만 요일 지정, 아니면 날짜 미지정에 추가
        day =
          weekday === '월' || weekday === '화' || weekday === '수' || weekday === '목' || weekday === '금'
            ? weekday
            : '날짜미지정';
      }

      dayIssueMap[day]?.push(issue);
    });

    return dayIssueMap;
  }, [sprintIssues]);
  return (
    <>
      <div className={styles.header}>
        <div className={styles.teamProfiles}>
          <div className={styles.profilePicture}></div>
          <div className={styles.profilePicture}></div>
          <div className={styles.profilePicture}></div>
        </div>
        <button className={styles.arrowButton} onClick={handleDecreaseWeek}>
          &lt;
        </button>
        <h2 className={styles.sprintTitle}>{currentWeek}주차</h2>
        <p>
          {dateToString(projectWeekList[currentWeek - 1]?.startDate)}~
          {dateToString(projectWeekList[currentWeek - 1]?.endDate)}
        </p>
        <button className={styles.arrowButton} onClick={handleIncreaseWeek}>
          &gt;
        </button>

        <div className={styles.buttonPlaceholder}>
          <Button children="스프린트 생성" colorType="blue" size="small" onClick={handleModalOpen}></Button>
        </div>
      </div>
      <div className={styles.weeklyProgressContainer}>
        {/* 요일 헤더 */}
        <div className={styles.contentheader}>
          {dayMap.map((day) => (
            <div key={day} className={styles.dayHeader}>
              {day}
              {dateMap?.[day]}
            </div>
          ))}
        </div>

        {/* 요일별 이슈 */}
        <div className={styles.issueGrid}>
          {dayMap.map((day) => (
            <div key={day} className={styles.dayColumn}>
              {issuesByDay[day]?.map((issue: any) => (
                <Issue
                  key={issue.issueKey}
                  title={issue.title}
                  status={issue.progress}
                  epicCode={issue.epicCode}
                  storyPoint={issue.storyPoint}
                  issueKey={issue.issueKey}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <SprintCreateModal onClose={handleModalClose} />}
    </>
  );
};

export default WeeklyProgress;
