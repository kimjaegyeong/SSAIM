import React, { useState } from 'react';
import styles from './IssueEditModal.module.css';
import { IssueDTO } from '@features/project/types/dashboard/WeeklyDataDTO';
import { useParams } from 'react-router-dom';
import { useEditIssue } from '../../hooks/sprint/useEditIssue';

interface IssueEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: IssueDTO;
}

const IssueEditModal: React.FC<IssueEditModalProps> = ({ isOpen, onClose, issue }) => {
  const [summary, setSummary] = useState(issue.summary);
  const [description, setDescription] = useState(issue.description);
  const [storyPoint, setStoryPoint] = useState(issue.storyPoint);
  const { projectId } = useParams();
  const editIssueMutation = useEditIssue(Number(projectId));

  const handleSave = () => {
    editIssueMutation.mutate(
      {
        assignee: '',
        issueKey: issue.issueKey,
        summary,
        description,
        storyPoint,
        epicCode: issue.epicCode,
        issueType: issue.issueType,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>이슈 수정</h2>

        {/* 읽기 전용 필드 표시 */}
        <div className={styles.issueDetails}>
          <p>
            <strong>이슈 키:</strong> {issue.issueKey}
          </p>
          <p>
            <strong>할당자:</strong> {issue.allocator}
          </p>
          <p>
            <strong>Epic 코드:</strong> {issue.epicCode ? issue.epicCode : 'Epic 미지정'}
          </p>
          <p>
            <strong>이슈 타입:</strong> {issue.issueType}
          </p>
          <p>
            <strong>진행 상태:</strong> {issue.progress}
          </p>
        </div>

        {/* 수정 가능한 필드 */}
        <label>제목</label>
        <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} className={styles.input} />

        <label>설명</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input} />

        <label>스토리 포인트</label>
        <input
          type="number"
          value={storyPoint}
          onChange={(e) => setStoryPoint(Number(e.target.value))}
          className={styles.input}
        />

        {/* 버튼 */}
        <div className={styles.buttonContainer}>
          <button onClick={handleSave} className={styles.saveButton}>
            저장
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueEditModal;
