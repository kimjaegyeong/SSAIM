import React, { useState, useEffect } from 'react';
import styles from './SprintModal.module.css';
import Button from '../../../../../components/button/Button';
import { useDailyRemind } from '@features/project/hooks/remind/useDailyRemind';
import { DailyRemindGetDTO } from '@features/project/types/remind/DailyRemindDTO';
import usePmIdStore from '@/features/project/stores/remind/usePmIdStore';
import { createSprintRemind } from '@features/project/apis/remind/createSprintRemind';
import Loading from '@/components/loading/Loading';
import { useSprintRemind } from '@/features/project/hooks/remind/useSprintRemind';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number; // 필요한 projectId를 prop으로 받음
}

interface SprintOption {
  id: string;
  label: string;
  period: string;
  startDate: string;
  endDate: string;
}

const SprintModal: React.FC<SprintModalProps> = ({ isOpen, onClose, projectId }) => {
  const { pmId } = usePmIdStore();
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
  const [sprintOptions, setSprintOptions] = useState<SprintOption[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // useDailyRemind 호출
  const { data: dailyReminds } = useDailyRemind({ projectId });

  // useSprintRemind 훅에서 refetch를 가져옴
  const { refetch } = useSprintRemind({
    projectId,
  });

  useEffect(() => {
    if (dailyReminds) {
      const groupByWeek = (reminds: DailyRemindGetDTO[]): SprintOption[] => {
        const weeks: Record<string, DailyRemindGetDTO[]> = {};
  
        reminds.forEach((remind) => {
          const date = new Date(remind.dailyRemindDate);
          const month = date.getMonth() + 1;
          const week = Math.ceil(date.getDate() / 7);
          const weekKey = `${date.getFullYear()}-${month}-${week}`;
          
          if (!weeks[weekKey]) weeks[weekKey] = [];
          weeks[weekKey].push(remind);
        });
  
        return Object.keys(weeks).map((weekKey, index) => {
          const [year, month, week] = weekKey.split('-');
          const weekData = weeks[weekKey];
  
          // 주의 첫 번째 날을 기준으로 주의 월요일과 금요일 계산
          const firstDate = new Date(weekData[0].dailyRemindDate);
          const monday = new Date(firstDate);
          const friday = new Date(firstDate);
  
          monday.setDate(firstDate.getDate() - firstDate.getDay() + 1); // 월요일 (일요일이 0이므로 +1)
          friday.setDate(monday.getDate() + 4); // 금요일 (월요일 + 4일)
  
          return {
            id: `sprint${index + 1}`,
            label: `${year}년 ${month}월 ${week}주차`,
            period: `${monday.toISOString().split('T')[0]} ~ ${friday.toISOString().split('T')[0]}`,
            startDate: monday.toISOString().split('T')[0],
            endDate: friday.toISOString().split('T')[0]
          };
        });
      };
  
      setSprintOptions(groupByWeek(dailyReminds));
    }
  }, [dailyReminds]);
  

  const handleSprintSelect = (sprintId: string) => {
    setSelectedSprint(sprintId);
  };

  const handleCreateSprintRemind = async () => {
    if (selectedSprint && pmId !== null) {
      const selectedOption = sprintOptions.find((option) => option.id === selectedSprint);
      if (selectedOption) {
        const sprintRemindPostData = {
          projectMemberId: pmId, // pmId (프로젝트 멤버 ID)
          startDate: selectedOption.startDate, // 선택된 스프린트의 startDate
          endDate: selectedOption.endDate // 선택된 스프린트의 endDate
        };
        
        setIsLoading(true); // 로딩 시작

        try {
          const response = await createSprintRemind(projectId, sprintRemindPostData);
          console.log('Sprint Remind created:', response);
          // 성공적으로 생성된 후 모달 닫기
          refetch();
          onClose();
        } catch (error) {
          console.error('Error creating sprint remind:', error);
        } finally {
          setIsLoading(false); // 로딩 종료
        }
      }
    }
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
        {isLoading ? ( // 로딩 중일 때
          <Loading />
        ) : (
          <Button size="medium" colorType="purple" onClick={handleCreateSprintRemind}>
            주간 회고 생성하기
          </Button>
        )}
      </div>
    </div>
  );
};

export default SprintModal;
