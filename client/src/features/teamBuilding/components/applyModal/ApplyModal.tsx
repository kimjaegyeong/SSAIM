// ApplyModal.tsx
import React from "react";
import styles from './applyModal.module.css';

interface ApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>신청현황</h2>
                <p>신청현황 내용이 여기에 표시됩니다.</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default ApplyModal;
