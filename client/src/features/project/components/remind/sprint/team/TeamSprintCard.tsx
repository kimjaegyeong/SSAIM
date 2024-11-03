import React from 'react';
import styles from './TeamSprintCard.module.css';

interface TeamSprintCardProps {
  userName: string;
  userImage: string;
  reviewText: string;
}

const TeamSprintCard: React.FC<TeamSprintCardProps> = ({ userName, userImage, reviewText }) => {
  return (
    <div className={styles.TeamSprintCard}>
      <div className={styles.reviewTitle}>
        <img src={userImage} alt="profile" />
        <div className={styles.userName}>{userName}</div>
      </div>
      <div className={styles.reviewText}>{reviewText}</div>
    </div>
  );
};

export default TeamSprintCard;
