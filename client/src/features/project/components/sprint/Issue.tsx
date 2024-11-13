import styles from './Issue.module.css';
import StatusSwitch from './StatusSwitch';
import React, { useState } from 'react';
import IssueEditModal from './IssueEditModal';
import { IssueDTO } from '../../types/dashboard/WeeklyDataDTO';
import { epicColors } from '../../utils/epicColors';
import { useUpdateIssueStatus } from '../../hooks/sprint/useUpdateIssueStatus';
import { useParams } from 'react-router-dom';
interface IssueProps {
  issue: IssueDTO;
  epicSummary: string;
}
const Issue: React.FC<IssueProps> = ({ issue, epicSummary }) => {
  const {projectId} = useParams();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const {mutate: updateIssueStatus} = useUpdateIssueStatus(Number(projectId), issue.issueKey);
  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  const epicCode = issue.epicCode?.split('-')[1];
  const lastDigit = epicCode ? parseInt(epicCode.slice(-1), 10) : null;
  const epicColor = lastDigit !== null ? epicColors[lastDigit] : '#888'; // 회색 기본값

  const handleChangeStatus = (status : 'todo'|'inProgress'|'done') => {
    console.log(issue.issueKey)
    updateIssueStatus(status, {
      onSuccess: () => {
        console.log('이슈 상태 변경 성공', status);
      },
      onError: (error) => {
        console.error('이슈상태 변경 오류:', error);
      },
    });

  }
  return (
    <div className={styles.issueContainer}>
      {/* 상단 - 이슈 이름과 ... 버튼 */}
      <div className={styles.issueHeader}>
        <span className={styles.issueName}>{issue.summary}</span>
        <button className={styles.moreButton} onClick={handleOpenEditModal}>
          ...
        </button>
      </div>

      {/* 하단 - 에픽 이름, 스토리 포인트, 상태 */}
      <div className={styles.issueFooter}>
        <span className={styles.epicName} style={{ color: epicColor }}>
          {epicCode ? `${epicSummary}` : 'No Epic'}
        </span>
        <span className={styles.storyPoint}>{issue.storyPoint}</span>
        <StatusSwitch status={issue.progress} onChange={handleChangeStatus} />
      </div>
      {/* Edit Modal */}
      {isEditModalOpen && (
        <IssueEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          issue={issue}
        />
      )}
    </div>
  );
};

export default Issue;
