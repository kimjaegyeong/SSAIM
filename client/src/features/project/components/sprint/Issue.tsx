import styles from './Issue.module.css';
import StatusSwitch from './StatusSwitch';
import React from 'react';

interface IssueProps {
  title : string;
  status : "해야 할 일" | "진행 중" | "완료";
  epicCode : string;
  storyPoint:number;
  issueKey : string;

}
const Issue:React.FC<IssueProps> = ({title, status, epicCode, storyPoint}) => {
  return (
    <div className={styles.issueContainer}>
      {/* 상단 - 이슈 이름과 ... 버튼 */}
      <div className={styles.issueHeader}>
        <span className={styles.issueName}>{title}</span>
        <button className={styles.moreButton}>...</button>
      </div>

      {/* 하단 - 에픽 이름, 스토리 포인트, 상태 */}
      <div className={styles.issueFooter}>
        <span className={styles.epicName}>{epicCode}</span>
        <span className={styles.storyPoint}>{storyPoint}</span>
        <StatusSwitch status={status} onChange={()=>{}}/>
      </div>
    </div>
  );
};

export default Issue;
