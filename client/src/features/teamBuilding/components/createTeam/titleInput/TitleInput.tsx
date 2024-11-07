import React from 'react';
import styles from '../CreateTeam.module.css';

interface TitleInputProps {
    title: string;
    onTitleChange: (title: string) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ title, onTitleChange }) => (
    <div className={styles.formGroup}>
        <label className={styles.sectionLabel}>게시글 제목</label>
        <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="게시글 제목을 입력하세요"
            className={styles.textInput}
        />
    </div>
);

export default TitleInput;
