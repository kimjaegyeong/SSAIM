import React from 'react';
import styles from './FilterHeader.module.css';
import { FaRegClock } from "react-icons/fa6";
import { IoSunny } from "react-icons/io5";
import { MdOutlineViewWeek } from "react-icons/md";
import Button from '../../../../components/button/Button';

interface FilterHeaderProps {
  dayWeek: string;
  setDayWeek: (value: string) => void;
  myTeam: string;
  setMyTeam: (value: string) => void;
  formattedDate: string;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ dayWeek, setDayWeek, myTeam, setMyTeam, formattedDate }) => {
  return (
    <div className={styles.filterHeader}>
      <div className={styles.dateTitle}>
        <FaRegClock style={{ strokeWidth: 4, color: "#007bff" }} />
        {formattedDate}
      </div>
      <div className={styles.filter}>
        <div className={styles.dayWeek}>
          <div onClick={() => setDayWeek('1일')} className={dayWeek === '1일' ? styles.active : styles.disactive}>
            <IoSunny />
            1일
          </div>
          <div onClick={() => setDayWeek('1주일')} className={dayWeek === '1주일' ? styles.active : styles.disactive}>
            <MdOutlineViewWeek /> 
            1주일
          </div>
        </div>
        <div className={styles.myTeam}>
        <Button 
            size="xsmall" 
            colorType={myTeam === '나의 회고' ? 'blue' : 'white'} 
            onClick={() => setMyTeam('나의 회고')}
          >
            나의 회고
          </Button>
          <Button 
            size="xsmall" 
            colorType={myTeam === '팀원 회고' ? 'blue' : 'white'} 
            onClick={() => setMyTeam('팀원 회고')}
          >
            팀원 회고
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterHeader;
