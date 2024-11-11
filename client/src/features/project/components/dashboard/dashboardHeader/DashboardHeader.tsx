import { useProjectListData } from '@/features/project/hooks/useProjectListData';
import styles from './DashboardHeader.module.css';
import React, { useEffect, } from 'react';
import useUserStore from '@/stores/useUserStore';
import { useDashboardStore } from '@/features/project/stores/useDashboardStore';
import { dateToString } from '@/utils/dateToString';

const DashboardHeader: React.FC = () => {
  const { userId } = useUserStore();
  const { data: projectListData } = useProjectListData(userId);
  const { projectId, setProjectId, setProjectWeek, currentWeek, projectWeekList, setCurrentWeek } = useDashboardStore();
  // 선택된 프로젝트의 제목 가져오기
  const selectedProject = projectListData?.find((project) => project.id === projectId);
  const projectTitle = selectedProject ? selectedProject.title : '프로젝트 선택';
  console.log(projectTitle);
  // 초기 상태 설정: projectId와 currentWeek 설정
  useEffect(() => {
    if (projectListData && projectListData.length > 0) {
      setProjectId(Number(projectListData[0].id));
      setProjectWeek(new Date(projectListData[0].startDate), new Date(projectListData[0].endDate));
    }
  }, [projectListData, setProjectId]);

  useEffect(() => {
    if (projectWeekList && projectWeekList.length > 0) {
      setCurrentWeek(projectWeekList.length - 1);
    }
  }, [projectWeekList, setCurrentWeek]);

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = Number(event.target.value);
    setProjectId(selectedProjectId);

    const selectedProject = projectListData?.find((e) => e.id === selectedProjectId);

    if (selectedProject?.startDate && selectedProject?.endDate) {
      setProjectWeek(new Date(selectedProject.startDate), new Date(selectedProject.endDate));
    } else {
      console.warn('Selected project does not have valid start or end dates.');
    }
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
      <div className={styles.dashboardHeader}>
        <button className={styles.arrowButton} onClick={handleDecreaseWeek}>
          &lt;
        </button>
        <h1 className={styles.title}>
          {projectTitle} {currentWeek + 1}주차
        </h1>
        <button className={styles.arrowButton} onClick={handleIncreaseWeek}>
          &gt;
        </button>
      </div>
      <div className={styles.dateRange}>
        <div>
          <select value={projectId} onChange={handleProjectChange} className={styles.projectSelect}>
            <option disabled value="">
              프로젝트 선택
            </option>
            {projectListData?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span>{dateToString(projectWeekList[currentWeek]?.startDate)}</span> ~{' '}
          <span>{dateToString(projectWeekList[currentWeek]?.endDate)}</span>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
