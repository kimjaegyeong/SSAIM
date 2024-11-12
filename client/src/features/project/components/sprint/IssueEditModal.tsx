import React, { useState } from 'react';
import styles from './IssueEditModal.module.css';
import { IssueDTO } from '@features/project/types/dashboard/WeeklyDataDTO';
interface IssueEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedIssue: IssueDTO) => void;
  issue: IssueDTO;
}

const IssueEditModal: React.FC<IssueEditModalProps> = ({ isOpen, onClose, onSave, issue }) => {
  const [title, setTitle] = useState(issue.title);
  const [status, setStatus] = useState(issue.progress);
  const [storyPoint, setStoryPoint] = useState(issue.storyPoint);

  const handleSave = () => {
    onSave({ title, progress, storyPoint });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>이슈 수정</h2>
        
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />

        <label>상태</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "해야 할 일" | "진행 중" | "완료")}
          className={styles.select}
        >
          <option value="해야 할 일">해야 할 일</option>
          <option value="진행 중">진행 중</option>
          <option value="완료">완료</option>
        </select>

        <label>스토리 포인트</label>
        <input
          type="number"
          value={storyPoint}
          onChange={(e) => setStoryPoint(Number(e.target.value))}
          className={styles.input}
        />

        <div className={styles.buttonContainer}>
          <button onClick={handleSave} className={styles.saveButton}>저장</button>
          <button onClick={onClose} className={styles.cancelButton}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default IssueEditModal;
