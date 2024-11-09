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
  //데이터 로드
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projectInfo } = useProjectInfo(Number(projectId));
  // 프로젝트 주차 리스트
  const projectWeekList = calculateWeeks(
    new Date(projectInfo.startDate as Date),
    new Date(projectInfo.endDate as Date)
  );
  // 프로젝트 멤버 리스트
  const projectMembers = projectInfo?.projectMemberFindResponseDtoList;
  // console.log(projectMembers)
  // 현재 주차 설정
  const [currentWeek, setCurrentWeek] = useState(0);
  // 프로젝트의 가장 최신 주차로 설정(이거 나중에 바꿔야됨 오늘 날짜기준 이번주로)
  useMemo(() => {
    setCurrentWeek(projectWeekList.length - 1);
  }, [projectWeekList.length]);
  // 해당 주차의 이슈 조회
  const { data: sprintIssues } = useSprintIssueQuery(
    Number(projectId),
    dateToString(projectWeekList[currentWeek - 1]?.startDate, '-'),
    dateToString(projectWeekList[currentWeek - 1]?.endDate, '-')
  );

  // 스프린트 생성 모달 상태
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

    console.log(projectWeekList);
    console.log(
      dateToString(projectWeekList[currentWeek - 1]?.startDate, '-'),
      dateToString(projectWeekList[currentWeek - 1]?.endDate, '-')
    );
  };

  // 요일 매핑 테이블 생성 (예: Mon, Tue, Wed, Thu, Fri)

  const dayMap: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | '날짜미지정'> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', '날짜미지정'];
  const dateMap: Record<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | '날짜미지정', number | undefined> = useMemo(() => {
    if (!projectWeekList[currentWeek - 1])
      return {
        Mon: undefined,
        Tue: undefined,
        Wed: undefined,
        Thu: undefined,
        Fri: undefined,
        날짜미지정: undefined,
      };
  
    const endDate = new Date(projectWeekList[currentWeek - 1].endDate);
  
    const Thu = new Date(endDate); // Thu요일 날짜
    const Wed = new Date(Thu);
    Wed.setDate(Wed.getDate() - 1);
    const Tue = new Date(Wed);
    Tue.setDate(Tue.getDate() - 1);
    const Mon = new Date(Tue);
    Mon.setDate(Mon.getDate() - 1);
    const Fri = new Date(Thu);
    Fri.setDate(Fri.getDate() + 1);
  
    return {
      Mon: Mon.getDate(),
      Tue: Tue.getDate(),
      Wed: Wed.getDate(),
      Thu: Thu.getDate(),
      Fri: Fri.getDate(),
      날짜미지정: undefined,
    };
  }, [projectWeekList, currentWeek]);
    // console.log(dateMap);
  // 요일별로 sprintIssues를 분류
  const issuesByDay = useMemo(() => {
    const dayIssueMap: Record<string, any[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
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
        const daysOfWeek = ['일요일', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', '토'];
        // console.log(issue.title, dateObj.getDay());
        const weekday = daysOfWeek[dateObj.getDay()];

        // 요일이 Mon~Fri에 해당하는 경우에만 요일 지정, 아니면 날짜 미지정에 추가
        day =
          weekday === 'Mon' || weekday === 'Tue' || weekday === 'Wed' || weekday === 'Thu' || weekday === 'Fri'
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
          {projectMembers.map((member) => {
            return;
            <div className={styles.profilePicture}>
              <img src={member.profilePicture} alt="" />
            </div>;
          })}
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
