// CreateTeamModal.tsx
import React from "react";
import styles from './CreateTeamModal.module.css';

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>팀 생성</h2>
                <p>팀 생성에 대한 내용이 여기에 표시됩니다.</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default CreateTeamModal;
