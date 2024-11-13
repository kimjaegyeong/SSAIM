import styles from './Issue.module.css';
import StatusSwitch from './StatusSwitch';
import React, { useState } from 'react';
import IssueEditModal from './IssueEditModal';
import { IssueDTO } from '../../types/dashboard/WeeklyDataDTO';
import { epicColors } from '../../utils/epicColors';

interface IssueProps {
  issue: IssueDTO;
  epicSummary: string;
}
const Issue: React.FC<IssueProps> = ({ issue, epicSummary }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  const epicCode = issue.epicCode?.split('-')[1];
  const lastDigit = epicCode ? parseInt(epicCode.slice(-1), 10) : null;
  const epicColor = lastDigit !== null ? epicColors[lastDigit] : '#888'; // 회색 기본값

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
        <StatusSwitch status={issue.progress} onChange={() => {}} />
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
