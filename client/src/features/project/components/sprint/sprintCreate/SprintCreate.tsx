import React, { useMemo} from 'react';
import styles from './SprintCreate.module.css';
import { useParams } from 'react-router-dom';
import { useSprintQuery } from '@/features/project/hooks/sprint/useSprintQuery';
import { format } from 'date-fns';
import IssueCreateForm from './IssueCreateForm';

const SprintCreate: React.FC = () => {
  const { projectId, sprintId } = useParams();
  const { data: sprint } = useSprintQuery(Number(projectId), Number(sprintId));


  // 외부 클릭 감지하여 드롭다운 닫기

  const weekdays = useMemo(() => {
    if (!sprint?.startDate || !sprint?.endDate) return [];
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const days = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const day = new Date(d);
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        days.push(format(day, 'yyyy-MM-dd'));
      }
    }
    return days;
  }, [sprint]);


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>스프린트 생성</h2>
      <hr />
      <IssueCreateForm/>
      <hr />
      <h3>주간 계획표</h3>
      <div className={styles.weeklyPlan}>
        {weekdays.map((day) => (
          <div key={day} className={styles.weekday}>
            <strong>{day}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SprintCreate;
