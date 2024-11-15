import React, { useState } from 'react';
import { IssueCreateDTO } from '@/features/project/types/sprint/IssueCreateDTO';
import { IssueDTO } from '@/features/project/types/dashboard/WeeklyDataDTO';
import { useSprintIssueStore } from '@/features/project/stores/useSprintIssueStore ';
import styles from './EditableIssue.module.css';
import { FaPen } from 'react-icons/fa6';

interface EditableIssueProps {
  issueData: IssueCreateDTO | IssueDTO;
  day: Date;
  isEditable: boolean;
}

// Issue가 IssueCreateDTO인지 IssueDTO인지 구분하는 타입 가드 함수
function isIssueCreateDTO(issue: IssueCreateDTO | IssueDTO): issue is IssueCreateDTO {
  return 'epic' in issue;
}

const EditableIssue: React.FC<EditableIssueProps> = ({ issueData, day, isEditable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableIssue, setEditableIssue] = useState<IssueCreateDTO | IssueDTO>(issueData);
  const { updateIssue } = useSprintIssueStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableIssue((prevIssue) => ({
      ...prevIssue,
      [name]: name === 'storyPoint' ? Number(value) : value,
    }));
  };
  const handleChangeStoryPoint = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableIssue((prevIssue) => ({
      ...prevIssue,
      [name]: name === 'storyPoint' ? Number(value) : value,
    }));
    if (isIssueCreateDTO(editableIssue)) {
      updateIssue(day, editableIssue);
    }
  };
  const handleSave = () => {
    // console.log(typeof editableIssue);
    // console.log(editableIssue, isEditable, isIssueCreateDTO(editableIssue));
    if (isEditable && isIssueCreateDTO(editableIssue)) {
      updateIssue(day, editableIssue);
      setIsEditing(false);
    }
  };
  const handleCancel = () => {
    setEditableIssue(issueData); // 초기 상태로 복원
    setIsEditing(false); // 편집 모드 종료
  };

  // epicKey 또는 epicCode 값을 가져오기
  const epicValue = isIssueCreateDTO(editableIssue) ? editableIssue.epic : editableIssue.epicCode;

  const handleEpicChange = (value: string) => {
    setEditableIssue((prevIssue) =>
      isIssueCreateDTO(prevIssue) ? { ...prevIssue, epicKey: value } : { ...prevIssue, epicCode: value }
    );
  };

  return (
    <div className={styles.issueContainer}>
      {/* 이슈 summary */}
      {isEditable && !isEditing && <FaPen onClick={() => isEditable && setIsEditing(true)} />}
      <div className={styles.issueHeader}>
        {isEditing && isEditable ? (
          <>
            <input
              type="text"
              name="summary"
              value={editableIssue.summary}
              onChange={handleChange}
              className={styles.input}
            />
          </>
        ) : (
          <span className={styles.issueName}>{editableIssue.summary}</span>
        )}
      </div>

      {/* 이슈 description */}
      <div className={styles.issueDescription}>
        {isEditing && isEditable ? (
          <input
            type="text"
            name="description"
            value={editableIssue.description}
            onChange={handleChange}
            className={styles.input}
          />
        ) : (
          <span onClick={() => isEditable && setIsEditing(true)}>{editableIssue.description}</span>
        )}
      </div>

      {/* epicKey/epicCode, storyPoint */}
      <div className={styles.issueDetails}>
        {isEditing && isEditable ? (
          <>
            <input
              type="text"
              name="epic"
              value={epicValue || ''}
              onChange={(e) => handleEpicChange(e.target.value)}
              className={styles.input}
              placeholder="Epic Key/Code"
            />
          </>
        ) : (
          <>
            <span className={styles.epicName}>{epicValue || 'No Epic'}</span>
            {isEditable && isEditable ? (
              <input
                type="number"
                name="storyPoint"
                value={editableIssue.storyPoint}
                onChange={handleChangeStoryPoint}
                className={styles.input}
                placeholder="Story Point"
                min={0}
                max={4}
              />
            ) : (
              <span>{editableIssue.storyPoint}</span>
            )}
          </>
        )}
      </div>

      {/* 저장 및 취소 버튼 */}
      {isEditing && isEditable && (
        <div className={styles.buttonContainer}>
          <button onClick={handleSave} className={styles.saveButton}>
            저장
          </button>
          <button onClick={handleCancel} className={styles.cancelButton}>
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableIssue;
