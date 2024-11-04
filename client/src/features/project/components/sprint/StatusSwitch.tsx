import React from 'react';
import styles from './StatusSwitch.module.css';

interface StatusSwitchProps {
  status: '할일' | '진행' | '완료';
  onChange: (status: '할일' | '진행' | '완료') => void;
}

const StatusSwitch: React.FC<StatusSwitchProps> = ({ status, onChange }) => {
  return (
    <div className={styles.switchContainer}>
      <button
        className={`${styles.switchButton} ${status === '할일' ? styles.active : ''}`}
        onClick={() => onChange('할일')}
      >
        할일
      </button>
      <button
        className={`${styles.switchButton} ${status === '진행' ? styles.active : ''}`}
        onClick={() => onChange('진행')}
      >
        진행
      </button>
      <button
        className={`${styles.switchButton} ${status === '완료' ? styles.active : ''}`}
        onClick={() => onChange('완료')}
      >
        완료
      </button>
    </div>
  );
};

export default StatusSwitch;
