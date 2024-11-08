import styles from './Sprint.module.css';
import Issue from './Issue';
import Button from '../../../../components/button/Button';
import { useState } from 'react';
import SprintCreateModal from './SprintCreateModal';
import { useSprintIssueQuery } from '../../hooks/useSprintIssueData';
import { useProjectInfo } from '../../hooks/useProjectInfo';
import { useParams } from 'react-router-dom';
import calculateWeeks from '../../utils/calculateWeeks';
import { dateToString } from '@/utils/dateToString';
const WeeklyProgress = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: projectInfo } = useProjectInfo(Number(projectId));
  // const projectWeekList = calculateWeeks(projectInfo.startDate, projectInfo.endDate);
  const projectWeekList = calculateWeeks(
    new Date(projectInfo.startDate as Date),
    new Date(projectInfo.endDate as Date)
  );
  const [currentWeek, setCurrentWeek] = useState(projectWeekList.length);
  const { data: sprintIssues } = useSprintIssueQuery(
    Number(projectId),
    dateToString(projectWeekList[currentWeek - 1]?.startDate, '-'),
    dateToString(projectWeekList[currentWeek - 1]?.endDate, '-')
  );
  console.log(projectWeekList);
  console.log(
    sprintIssues,
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
          {['월', '화', '수', '목', '금', '날짜 미지정'].map((day) => (
            <div key={day} className={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        {/* 요일별 이슈 */}
        <div className={styles.issueGrid}>
          {['월', '화', '수', '목', '금', '날짜 미지정'].map((day) => (
            <div key={day} className={styles.dayColumn}>
              {sprintIssues?.map((issue: any) => (
                <Issue
                  title={issue.title}
                  status={issue.status}
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
