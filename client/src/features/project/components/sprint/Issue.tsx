import styles from './Issue.module.css';
import StatusSwitch from './StatusSwitch';

const Issue = () => {
  return (
    <div className={styles.issueContainer}>
      {/* 상단 - 이슈 이름과 ... 버튼 */}
      <div className={styles.issueHeader}>
        <span className={styles.issueName}>이슈 이름</span>
        <button className={styles.moreButton}>...</button>
      </div>

      {/* 하단 - 에픽 이름, 스토리 포인트, 상태 */}
      <div className={styles.issueFooter}>
        <span className={styles.epicName}>에픽 이름</span>
        <span className={styles.storyPoint}>5</span>
        <StatusSwitch status='할일' onChange={()=>{}}/>
      </div>
    </div>
  );
};

export default Issue;
