import React, { useState, useEffect } from 'react';
import styles from './SprintModal.module.css';
import Button from '../../../../../components/button/Button';
import { useDailyRemind } from '@features/project/hooks/remind/useDailyRemind';
import { DailyRemindGetDTO } from '@features/project/types/remind/DailyRemindDTO';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number; // 필요한 projectId를 prop으로 받음
}

interface SprintOption {
  id: string;
  label: string;
  period: string;
}

const SprintModal: React.FC<SprintModalProps> = ({ isOpen, onClose, projectId }) => {
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
  const [sprintOptions, setSprintOptions] = useState<SprintOption[]>([]);

  // useDailyRemind 호출
  const { data: dailyReminds } = useDailyRemind({ projectId });

  useEffect(() => {
    if (dailyReminds) {
      // 주 단위로 그룹화하는 함수
      const groupByWeek = (reminds: DailyRemindGetDTO[]): SprintOption[] => {
        const weeks: Record<string, DailyRemindGetDTO[]> = {};

        reminds.forEach((remind) => {
          const date = new Date(remind.dailyRemindDate);
          const month = date.getMonth() + 1; // 월 (0~11이므로 1을 더해줌)
          const week = Math.ceil(date.getDate() / 7); // 해당 달 기준으로 주차 계산
          const weekKey = `${date.getFullYear()}-${month}-${week}`;
          
          if (!weeks[weekKey]) weeks[weekKey] = [];
          weeks[weekKey].push(remind);
        });

        // 각 주 데이터를 SprintOption 배열로 변환
        return Object.keys(weeks).map((weekKey, index) => {
          const [year, month, week] = weekKey.split('-');
          const weekData = weeks[weekKey];
          const startDate = weekData[0].dailyRemindDate;
          const endDate = weekData[weekData.length - 1].dailyRemindDate;
          
          return {
            id: `sprint${index + 1}`,
            label: `${year}년 ${month}월 ${week}주차`,
            period: `${startDate} ~ ${endDate}`
          };
        });
      };

      // 그룹화된 주 단위 옵션을 설정
      setSprintOptions(groupByWeek(dailyReminds));
    }
  }, [dailyReminds]);

  const handleSprintSelect = (sprintId: string) => {
    setSelectedSprint(sprintId);
  };

  if (!isOpen) return null;

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
        <Button size="medium" colorType="purple">주간 회고 생성하기</Button>
      </div>
    </div>
  );
};

export default SprintModal;
