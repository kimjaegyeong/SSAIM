import React, { useState } from 'react';
import styles from './SprintModal.module.css';
import Button from '../../../../../components/button/Button';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface SprintOption {
  id: string;
  label: string;
  period: string;
}

const SprintModal: React.FC<SprintModalProps> = ({ isOpen, onClose }) => {
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
  if (!isOpen) return null;

  const sprintOptions: SprintOption[] = [
    {
      id: "sprint1",
      label: "2024년 10월 2주차",
      period: "2024.10.07 ~ 2024.10.11"
    },
    {
      id: "sprint2",
      label: "2024년 10월 3주차",
      period: "2024.10.14 ~ 2024.10.18"
    },
    {
      id: "sprint3",
      label: "2024년 10월 4주차",
      period: "2024.10.21 ~ 2024.10.25"
    }
  ];

  const handleSprintSelect = (sprintId: string) => {
    setSelectedSprint(sprintId);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.h2}>주간 회고 생성</h2>
        <p className={styles.p}>프로젝트명</p>
        <div className={styles.selectBox}>
            <div className={styles.sprintOptions}>
            {sprintOptions.map((sprint) => (
                <label key={sprint.id} className={styles.sprintOption}>
                <div className={styles.checkbox}>
                    <input
                    type="checkbox"
                    checked={selectedSprint === sprint.id}
                    onChange={() => handleSprintSelect(sprint.id)}
                    />
                    <div className={styles.sprintInfo}>
                        <div className={styles.sprintLabel}>{sprint.label}</div>
                        <div className={styles.sprintPeriod}>{sprint.period}</div>
                    </div>
                </div>
                </label>
            ))}
            </div>
        </div>
        <Button size="medium" colorType="purple" >주간 회고 생성하기</Button>
      </div>
    </div>
  );
};

export default SprintModal;
