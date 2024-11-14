import styles from './WeeklySprint.module.css';
import Issue from './Issue';
import Button from '../../../../components/button/Button';
import { useState, useMemo, useEffect } from 'react';
import { useSprintIssueQuery } from '../../hooks/useSprintIssueData';
import { useProjectInfo } from '../../hooks/useProjectInfo';
import { useParams, useNavigate } from 'react-router-dom';
import calculateWeeks from '../../utils/calculateWeeks';
import { dateToString } from '@/utils/dateToString';
import { ProjectInfoMemberDTO } from '@features/project/types/ProjectDTO';
import { getInitialCurrentWeek } from '../../utils/getInitialCurrentWeek';
import { IssueDTO } from '@features/project/types/dashboard/WeeklyDataDTO';
import { useEpicListData } from '../../hooks/sprint/useEpicListData';
import DefaultProfile from '@/assets/profile/DefaultProfile.png'
const WeeklySprint = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projectInfo } = useProjectInfo(Number(projectId));
  console.log(projectInfo)
  const {data : epicList } = useEpicListData(Number(projectId));
  const projectWeekList = calculateWeeks(
    new Date(projectInfo?.startDate as Date),
    new Date(projectInfo?.endDate as Date)
  );
  const projectMembers = projectInfo?.projectMembers;
  const [currentWeek, setCurrentWeek] = useState(-1);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const navigate = useNavigate();
  // projectWeekList가 처음 로드될 때만 currentWeek를 설정하도록 조건 추가
  useEffect(() => {
    if (currentWeek === -1 && projectWeekList.length > 0) {
      console.log(projectWeekList)
      console.log(getInitialCurrentWeek(projectWeekList))
      setCurrentWeek(getInitialCurrentWeek(projectWeekList));
    }
  }, [projectWeekList, currentWeek, setCurrentWeek]);

  // 이하 코드 유지
  const { data: sprintIssues } = useSprintIssueQuery(
    Number(projectId),
    dateToString(projectWeekList[currentWeek]?.startDate, '-'),
    dateToString(projectWeekList[currentWeek]?.endDate, '-')
  );

  const epicCodeMap = useMemo(() => {
    const map: Record<string, string> = {};
    epicList?.forEach((epic) => {
      map[epic.key] = epic.summary;
    });
    return map;
  }, [epicList]);
  
  const navigateToSprintList = () => {
    navigate(`list`);
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

  // 나머지 코드 유지

  const dayMap: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | '날짜미지정'> = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    '날짜미지정',
  ];

  const dateMap = useMemo(() => {
    if (!projectWeekList[currentWeek])
      return {
        Mon: undefined,
        Tue: undefined,
        Wed: undefined,
        Thu: undefined,
        Fri: undefined,
        날짜미지정: undefined,
      };

    const endDate = new Date(projectWeekList[currentWeek].endDate);
    const Mon = new Date(endDate);
    Mon.setDate(endDate.getDate() - 3);
    const Tue = new Date(Mon);
    Tue.setDate(Mon.getDate() + 1);
    const Wed = new Date(Tue);
    Wed.setDate(Tue.getDate() + 1);
    const Thu = new Date(Wed);
    Thu.setDate(Wed.getDate() + 1);
    const Fri = new Date(Thu);
    Fri.setDate(Thu.getDate() + 1);

    return {
      Mon: Mon.getDate(),
      Tue: Tue.getDate(),
      Wed: Wed.getDate(),
      Thu: Thu.getDate(),
      Fri: Fri.getDate(),
      날짜미지정: undefined,
    };
  }, [projectWeekList, currentWeek]);
  
  const issuesByDay = useMemo(() => {
    const dayIssueMap: Record<string, IssueDTO[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      날짜미지정: [],
    };

    sprintIssues?.forEach((issue: IssueDTO) => {
      if (selectedMember && issue.allocator !== selectedMember) return;

      const match = issue?.summary.match(/(\d{6})/);
      let day = '날짜미지정';

      if (match) {
        const dateStr = match[0];
        const year = 2000 + parseInt(dateStr.slice(0, 2), 10);
        const month = parseInt(dateStr.slice(2, 4), 10) - 1;
        const date = parseInt(dateStr.slice(4, 6), 10);
        const dateObj = new Date(year, month, date);
        const daysOfWeek = ['일요일', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', '토'];
        const weekday = daysOfWeek[dateObj.getDay()];
        day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday) ? weekday : '날짜미지정';
      }

      dayIssueMap[day]?.push(issue);
    });
    console.log(dayIssueMap)
    return dayIssueMap;
  }, [sprintIssues, selectedMember]);

  const handleFilterMember = (memberName: string) => {
    setSelectedMember(selectedMember === memberName ? null : memberName);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.teamProfiles}>
          {projectMembers?.map((member: ProjectInfoMemberDTO) => (
            <div
              key={member.name}
              className={`${styles.profilePictureContainer} ${selectedMember === member.name ? styles.activeProfile : ''}`}
              onClick={() => handleFilterMember(member.name)}
            >
              <img src={member.profileImage?.length>0 ? member.profileImage : DefaultProfile} alt={member.name} className={styles.profilePicture} />
              <span className={styles.profileLabel}>{member.name}</span>
            </div>
          ))}
        </div>
        <button className={styles.arrowButton} onClick={handleDecreaseWeek}>
          &lt;
        </button>
        <h2 className={styles.sprintTitle}>{currentWeek+1}주차</h2>
        <p>
          {dateToString(projectWeekList[currentWeek]?.startDate)} ~{' '}
          {dateToString(projectWeekList[currentWeek]?.endDate)}
        </p>
        <button className={styles.arrowButton} onClick={handleIncreaseWeek}>
          &gt;
        </button>

        <div className={styles.buttonPlaceholder}>
          <Button children="스프린트 생성" colorType="blue" size="small" onClick={navigateToSprintList} />
        </div>
      </div>
      <div className={styles.weeklyProgressContainer}>
        <div className={styles.contentheader}>
          {dayMap.map((day) => (
            <div key={day} className={styles.dayHeader}>
              {day}
              {dateMap[day]}
            </div>
          ))}
        </div>

        <div className={styles.issueGrid}>
          {dayMap.map((day) => (
            <div key={day} className={styles.dayColumn}>
              {issuesByDay[day]?.map((issue: IssueDTO) => (
                <Issue
                issue={issue}
                epicSummary={epicCodeMap[issue.epicCode]}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeeklySprint;
