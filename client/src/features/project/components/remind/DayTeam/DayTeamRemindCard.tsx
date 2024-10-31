import React from 'react';
import styles from './DayTeamRemindCard.module.css';

interface DayTeamRemindCardProps {
  userName: string;
  userImage: string;
  reviewText: string;
}

const DayTeamRemindCard: React.FC<DayTeamRemindCardProps> = ({ userName, userImage, reviewText }) => {
  return (
    <div className={styles.DayTeamRemindCard}>
      <div className={styles.reviewTitle}>
        <img src={userImage} alt="profile" />
        <div className={styles.userName}>{userName}</div>
      </div>
      <div className={styles.reviewText}>{reviewText}</div>
    </div>
  );
};

export default DayTeamRemindCard;
