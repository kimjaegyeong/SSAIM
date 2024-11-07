import React from 'react';
import styles from '../CreateTeam.module.css';

interface ContentInputProps {
    content: string;
    onContentChange: (content: string) => void;
}

const ContentInput: React.FC<ContentInputProps> = ({ content, onContentChange }) => (
    <div className={styles.formGroup}>
        <label className={styles.sectionLabel}>게시글 본문</label>
        <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="게시글 본문을 입력하세요"
            className={styles.textArea}
        ></textarea>
    </div>
);

export default ContentInput;
