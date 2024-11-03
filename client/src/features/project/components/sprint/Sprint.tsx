import styles from './Sprint.module.css';
import Issue from './Issue';

const WeeklyProgress = () => {
  return (
    <div className={styles.weeklyProgressContainer}>
      {/* 요일 헤더 */}
      <div className={styles.header}>
        {['월', '화', '수', '목', '금'].map((day) => (
          <div key={day} className={styles.dayHeader}>{day}</div>
        ))}
      </div>

      {/* 요일별 이슈 */}
      <div className={styles.issueGrid}>
        {['월', '화', '수', '목', '금'].map((day) => (
          <div key={day} className={styles.dayColumn}>
            <Issue />
            <Issue />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgress;
