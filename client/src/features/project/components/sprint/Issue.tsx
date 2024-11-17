import styles from './Issue.module.css';
import StatusSwitch from './StatusSwitch';
import React, { useEffect, useState } from 'react';
import IssueEditModal from './IssueEditModal';
import { IssueDTO } from '../../types/dashboard/WeeklyDataDTO';
import { epicColors } from '../../utils/epicColors';
import { useUpdateIssueStatus } from '../../hooks/sprint/useUpdateIssueStatus';
import { useParams } from 'react-router-dom';
import { showToast } from '@/utils/toastUtils';
import { toast } from 'react-toastify';

interface IssueProps {
  issue: IssueDTO;
  epicSummary: string;
}
const statusMap: Record<string, '해야 할 일' | '진행 중' | '완료'> = {
  todo: '해야 할 일',
  inProgress: '진행 중',
  done: '완료',
};

const Issue: React.FC<IssueProps> = ({ issue, epicSummary }) => {
  const { projectId } = useParams();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // 상태 변경 요청 중 상태
  const [currentStatus, setCurrentStatus] = useState<'해야 할 일' | '진행 중' | '완료'>(issue.progress); // 현재 상태 관리
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false); // summary 확장 여부

  const { mutate: updateIssueStatus } = useUpdateIssueStatus(Number(projectId), issue.issueKey);
  useEffect(() => {
    setCurrentStatus(issue.progress); // 초기 상태 설정
  }, [issue]);
  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  const epicCode = issue.epicCode?.split('-')[1];
  const lastDigit = epicCode ? parseInt(epicCode.slice(-1), 10) : null;
  const epicColor = lastDigit !== null ? epicColors[lastDigit] : '#888'; // 회색 기본값

  const handleChangeStatus = (status: 'todo' | 'inProgress' | 'done') => {
    if (isUpdating) return; // 중복 호출 방지
    setCurrentStatus(statusMap[status]); // 상태 업데이트
    setIsUpdating(true); // 중간 상태 설정
    updateIssueStatus(status, {
      onSuccess: () => {
        setCurrentStatus(statusMap[status]); // 상태 업데이트
        const toastId = `${status}-changed`;
        if (!toast.isActive(toastId)) {
          showToast.success(`${issue.summary} 이슈 상태가 ${statusMap[status]}로 변경되었습니다.`, { issueId: `${status}-changed` });
        }
      },
      onError: (error) => {
        console.error('이슈 상태 변경 오류:', error);
        showToast.error('이슈 상태 변경에 실패했습니다.');
        setCurrentStatus(issue.progress); // 상태 업데이트
      },
      onSettled: () => {
        setIsUpdating(false); // 중간 상태 해제
      },
    });
  };

  return (
    <div className={styles.issueContainer}>
      {/* 상단 - 이슈 이름과 ... 버튼 */}
      <div className={styles.issueHeader}>
        <span
          className={`${styles.issueName} ${!isSummaryExpanded ? styles.collapsed : ''}`}
          title={!isSummaryExpanded ? issue.summary : undefined} // 마우스를 올리면 전체 내용 표시
        >
          {issue.summary}
        </span>
        {issue.summary.length > 60 && (
          <button
            className={styles.toggleButton}
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          >
            {isSummaryExpanded ? '간략히' : '더보기'}
          </button>
        )}
        <button className={styles.moreButton} onClick={handleOpenEditModal}>
          ...
        </button>
      </div>

      {/* 하단 - 에픽 이름, 스토리 포인트, 상태 */}
      <div className={styles.issueFooter}>
        <span
          className={styles.epicName}
          title={epicSummary} // 마우스를 올리면 전체 내용 표시
          style={{ color: epicColor }}
        >
          {epicCode ? `${epicSummary}` : 'No Epic'}
        </span>
        <span className={styles.storyPoint}>{issue.storyPoint}</span>
        <StatusSwitch status={currentStatus} onChange={handleChangeStatus} />
      </div>
      {/* Edit Modal */}
      {isEditModalOpen && <IssueEditModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} issue={issue} />}
    </div>
  );
};

export default Issue;
