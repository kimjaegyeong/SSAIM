import React from 'react';
import styles from './SprintAutoCreateModal.module.css';

interface SprintCreateModalProps {
  onClose: () => void;
}

const SprintCreateModal: React.FC<SprintCreateModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>스프린트 제목</h2>
          <button className={styles.closeButton} onClick={onClose}>X</button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p>이번주 할일</p>
          <textarea className={styles.inputArea} placeholder="스프린트 내용을 입력하세요..." />
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.createButton}>스프린트 이슈 생성</button>
        </div>
      </div>
    </div>
  );
};

export default SprintCreateModal;
