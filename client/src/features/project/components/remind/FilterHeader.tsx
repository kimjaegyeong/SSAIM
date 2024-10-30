import React from 'react';
import styles from './FilterHeader.module.css';
import { FaRegClock } from "react-icons/fa6";

interface FilterHeaderProps {
  dayWeek: string;
  setDayWeek: (value: string) => void;
  myTeam: string;
  setMyTeam: (value: string) => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ dayWeek, setDayWeek, myTeam, setMyTeam }) => {
  return (
    <div className={styles.filterHeader}>
      <div className={styles.dateTitle}>
        <FaRegClock style={{ strokeWidth: 4, color: "#007bff" }} />
        2024년 10월 30일 (수)
      </div>
      <div className={styles.filter}>
        <div className={styles.dayWeek}>
          <div onClick={() => setDayWeek('1일')} className={dayWeek === '1일' ? styles.active : ''}>1일</div>
          <div onClick={() => setDayWeek('1주일')} className={dayWeek === '1주일' ? styles.active : ''}>1주일</div>
        </div>
        <div className={styles.myTeam}>
          <div onClick={() => setMyTeam('나의 회고')} className={myTeam === '나의 회고' ? styles.active : ''}>나의 회고</div>
          <div onClick={() => setMyTeam('팀원 회고')} className={myTeam === '팀원 회고' ? styles.active : ''}>팀원 회고</div>
        </div>
      </div>
    </div>
  );
};

export default FilterHeader;
