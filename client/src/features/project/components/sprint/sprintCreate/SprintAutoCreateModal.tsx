import React, { useState, useEffect } from 'react';
import styles from './SprintAutoCreateModal.module.css';
import { generateIssue } from '@/features/project/apis/sprint/generate/generateIssue';
import { useParams } from 'react-router-dom';
import { GenarateIssueRequestDTO } from '@/features/project/types/sprint/GenDTO';
import { useSprintQuery } from '@/features/project/hooks/sprint/useSprintQuery';
import { format } from 'date-fns';
import useUserStore from '@/stores/useUserStore';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
import Loading from '@/components/loading/Loading';
import { useSprintIssueStore } from '@/features/project/stores/useSprintIssueStore ';

interface SprintCreateModalProps {
  onClose: () => void;
}

const SprintCreateModal: React.FC<SprintCreateModalProps> = ({ onClose }) => {
  const { projectId, sprintId } = useParams();
  const { data: sprint } = useSprintQuery(Number(projectId), Number(sprintId));
  const { userId } = useUserStore(); // 사용자 정보 가져오기
  const { data: userInfo } = useUserInfoData(userId);
  const userName = userInfo?.userName; // 사용자 이름

  //stores
  const { addIssue } = useSprintIssueStore();
  // State 관리
  const [message, setMessage] = useState('');
  // const [assignee, setAssignee] = useState(userName || ''); // assignee를 사용자 정보로 초기화
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // sprint 데이터로 startDate와 endDate 초기화
  useEffect(() => {
    if (sprint) {
      setStartDate(format(new Date(sprint.startDate), 'yyyy-MM-dd'));
      setEndDate(format(new Date(sprint.endDate), 'yyyy-MM-dd'));
    }
  }, [sprint]);

  const handleCreateIssue = async () => {
    // DTO에 맞게 데이터를 구성
    const requestData: GenarateIssueRequestDTO = {
      message,
      assignee: userName || '', // userName이 undefined일 경우 빈 문자열을 할당
      startDate,
      endDate,
    };
    setIsLoading(true);

    try {
      const issues = await generateIssue(Number(projectId), requestData);

      if (Array.isArray(issues)) {
        // 반환값이 배열인지 확인
        issues.forEach((dailyIssue) => {
          dailyIssue.tasks.forEach((task) => {
            addIssue(new Date(dailyIssue.day), task); // sprintIssueStore.js 에서 addIssue를 호출
          });
        });
        console.log('Generated Issues:', issues);
      } else {
        console.error('Unexpected response:', issues);
      }
    } catch (error) {
      console.error('Error generating issues:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };
  if (isLoading) {
    return <Loading />; // 로딩 중일 때 로딩 컴포넌트 표시
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>스프린트 제목</h2>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p>이번주 할일</p>
          <textarea
            className={styles.inputArea}
            placeholder="스프린트 내용을 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.createButton} onClick={handleCreateIssue}>
            스프린트 이슈 생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintCreateModal;
