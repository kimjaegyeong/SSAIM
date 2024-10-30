import React from 'react';
import styles from './ProjectHeader.module.css';

interface ProjectHeaderProps {
  projectId: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectId })=> {
  return (
    <div className={styles.projectHeader}>
      <h1 className={styles.projectTitle}>프로젝트 이름</h1>
      <nav className={styles.projectNavbar}>
        <ul className={styles.navList}>
          <li><a href={`/project/${projectId}`} className={styles.navLink}>개요</a></li>
          <li><a href={`/project/${projectId}/sprint`} className={styles.navLink}>주간 진행상황</a></li>
          <li><a href={`/project/${projectId}/output`} className={styles.navLink}>산출물</a></li>
          <li><a href={`/project/${projectId}/meeting`} className={styles.navLink}>회의록</a></li>
          <li><a href={`/project/${projectId}/remind`} className={styles.navLink}>회고</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default ProjectHeader;
