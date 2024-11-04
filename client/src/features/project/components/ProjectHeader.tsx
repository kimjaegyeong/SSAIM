import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './ProjectHeader.module.css';

interface ProjectHeaderProps {
  projectId: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectId }) => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname.startsWith(path); // 경로가 주어진 경로로 시작하는지 확인
  };

  const getLinkClass = (path: string) => {
    return isActiveLink(path) ? styles.activeLink : styles.navLink;
  };

  return (
    <div className={styles.projectHeader}>
      <h1 className={styles.projectTitle}>프로젝트 이름</h1>
      <nav className={styles.projectNavbar}>
        <ul className={styles.navList}>
          <li><a href={`/project/${projectId}/info`} className={getLinkClass(`/project/${projectId}/info`)}>개요</a></li>
          <li><a href={`/project/${projectId}/sprint`} className={getLinkClass(`/project/${projectId}/sprint`)}>주간 진행상황</a></li>
          <li><a href={`/project/${projectId}/output`} className={getLinkClass(`/project/${projectId}/output`)}>산출물</a></li>
          <li><a href={`/project/${projectId}/meeting`} className={getLinkClass(`/project/${projectId}/meeting`)}>회의록</a></li>
          <li><a href={`/project/${projectId}/remind`} className={getLinkClass(`/project/${projectId}/remind`)}>회고</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default ProjectHeader;
