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
import { ProjectInfoMemberDTO } from '@features/project/types/ProjectDTO';

const WeeklyProgress = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projectInfo } = useProjectInfo(Number(projectId));
  const projectWeekList = calculateWeeks(
    new Date(projectInfo.startDate as Date),
    new Date(projectInfo.endDate as Date)
  );
  const projectMembers = projectInfo?.projectMemberFindResponseDtoList;
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedMember, setSelectedMember] = useState<string | null>(null); // 선택된 멤버 상태 추가

  useMemo(() => {
    setCurrentWeek(projectWeekList.length - 1);
  }, [projectWeekList.length]);

  const { data: sprintIssues } = useSprintIssueQuery(
    Number(projectId),
    dateToString(projectWeekList[currentWeek - 1]?.startDate, '-'),
    dateToString(projectWeekList[currentWeek - 1]?.endDate, '-')
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

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

  const dayMap: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | '날짜미지정'> = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    '날짜미지정',
  ];
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
    const Thu = new Date(endDate);
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

  // 요일별로 이슈를 필터링하며, 선택된 멤버의 이슈만 포함
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
      if (selectedMember && issue.allocater !== selectedMember) return; // 선택된 멤버가 아니면 필터링

      const match = issue.title.match(/(\d{6})/);
      let day = '날짜 미지정';

      if (match) {
        const dateStr = match[0];
        const year = 2000 + parseInt(dateStr.slice(0, 2), 10);
        const month = parseInt(dateStr.slice(2, 4), 10) - 1;
        const date = parseInt(dateStr.slice(4, 6), 10);
        const dateObj = new Date(year, month, date);
        const daysOfWeek = ['일요일', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', '토'];
        const weekday = daysOfWeek[dateObj.getDay()];
        day =
          weekday === 'Mon' || weekday === 'Tue' || weekday === 'Wed' || weekday === 'Thu' || weekday === 'Fri'
            ? weekday
            : '날짜미지정';
      }

      dayIssueMap[day]?.push(issue);
    });

    return dayIssueMap;
  }, [sprintIssues, selectedMember]);

  const handleFilterMember = (memberName: string) => {
    setSelectedMember(selectedMember === memberName ? null : memberName); // 클릭된 멤버 필터링 상태 전환
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.teamProfiles}>
          {projectMembers?.map((member: ProjectInfoMemberDTO) => (
            <div
              key={member.name}
              className={`${styles.profilePicture} ${selectedMember === member.name ? styles.activeProfile : ''}`}
              onClick={() => handleFilterMember(member.name)}
            >
              <img src={member.profileImage} alt={member.name} />
            </div>
          ))}
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
        <div className={styles.contentheader}>
          {dayMap.map((day) => (
            <div key={day} className={styles.dayHeader}>
              {day}
              {dateMap?.[day]}
            </div>
          ))}
        </div>

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
