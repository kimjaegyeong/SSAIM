import React from 'react';
import styles from './MeetingItem.module.css';
import { Meeting } from '../../types/meeting/Meeting';
import meetingIcon from '../../../../assets/meeting/meetingIcon.png'

interface MeetingItemProps {
  meeting: Meeting;
  onClick?: (meeting: Meeting) => void;
}

const MeetingItem: React.FC<MeetingItemProps> = ({ meeting, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(meeting);
    }
  };

  return (
    <div className={styles.meetingItem} onClick={handleClick}>
      <img src={meetingIcon} alt="Meeting Icon" className={styles.meetingIcon}/>
      <div className={styles.meetingContent}>
        <div className={styles.meetingHeader}>
          <h3>{meeting.title}</h3>
          <div className={styles.meetingDescription}>{meeting.description}</div>
        </div>
        <div className={styles.meetingTime}>
          {meeting.date} 
        </div>
        <div className={styles.meetingMeta}>
          {meeting.duration}
        </div>
      </div>
    </div>
  );
};

export default MeetingItem;