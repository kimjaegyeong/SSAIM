// DashboardHeader.tsx
import styles from './DashboardHeader.module.css';
import React from 'react';

const DashboardHeader: React.FC = () => {
  return (
    <>
      <div className={styles.dashboardHeader}>
        <button className={styles.arrowButton}>&lt;</button>
        <h1 className={styles.title}>특화 프로젝트 1주차</h1>
        <button className={styles.arrowButton}>&gt;</button>
      </div>
      <div className={styles.dateRange}>
        <span>2024.10.28</span> ~ <span>2024.11.01</span>
      </div>
    </>
  );
};

export default DashboardHeader;
