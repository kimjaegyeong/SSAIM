import styles from './Sprint.module.css';
import Issue from './Issue';
import Button from '../../../../components/button/Button';
import { useState } from 'react';
import SprintCreateModal from './SprintCreateModal';

const WeeklyProgress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen =()=> {
    setIsModalOpen(true);
  }
  const handleModalClose = () => {
    setIsModalOpen(false);
  }
  return (
    <>
      <div className={styles.header}>
        <div className={styles.teamProfiles}>
          <div className={styles.profilePicture}></div>
          <div className={styles.profilePicture}></div>
          <div className={styles.profilePicture}></div>
        </div>
        <h2 className={styles.sprintTitle}>스프린트 제목</h2>
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
          {['월', '화', '수', '목', '금','날짜 미지정'].map((day) => (
            <div key={day} className={styles.dayColumn}>
              <Issue />
            </div>
          ))}
        </div>
      </div>
      {
        isModalOpen && (
          <SprintCreateModal onClose={handleModalClose}/>
        )
      }
    </>
  );
};

export default WeeklyProgress;
