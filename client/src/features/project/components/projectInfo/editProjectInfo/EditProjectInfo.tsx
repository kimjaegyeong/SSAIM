import styles from './EditProjectInfo.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import React, { useState } from 'react';
import TeamMemberGrid from '@features/project/components/projectCreate/teamMember/TeamMemberGrid';

interface EditProjectInfoModalProps {
  onClose: () => void;
}

const EditProjectInfoModal: React.FC<EditProjectInfoModalProps> = ({ onClose }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [image] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [jiraApi, setJiraApi] = useState('');
  const [gitlabApi, setGitlabApi] = useState('');

  const handleImageClick = () => {
    // 이미지 선택 로직
  };

  const handleSave = () => {
    // 수정 완료 로직
    console.log('프로젝트 정보 저장:', {
      projectName,
      teamName,
      jiraApi,
      gitlabApi,
      startDate,
      endDate,
    });
    onClose();
  };

  const handleCancel = () => {
    // 취소 로직
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        
        <div className={styles.topSection}>
          {/* 왼쪽 구역 - 대표 사진 */}
          <div className={styles.imageSection} onClick={handleImageClick}>
            {image ? (
              <img src={image} alt="대표 사진" className={styles.image} />
            ) : (
              <div className={styles.imagePlaceholder}>사진 추가</div>
            )}
          </div>
          {/* 오른쪽 구역 - 프로젝트 이름 및 팀 이름 */}
          <div className={styles.infoSection}>
            <input
              type="text"
              placeholder="프로젝트 이름"
              className={styles.input}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <input
              type="text"
              placeholder="팀 이름"
              className={styles.input}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
        </div>

        {/* 팀원 추가 모달 (현재 비워둠) */}
        <div className={styles.teamMemberModal}>
          <TeamMemberGrid />
        </div>

        {/* Jira 및 GitLab API 수정 섹션 */}
        <div className={styles.apiSection}>
          <input
            type="text"
            placeholder="Jira API"
            className={styles.input}
            value={jiraApi}
            onChange={(e) => setJiraApi(e.target.value)}
          />
          <input
            type="text"
            placeholder="GitLab API"
            className={styles.input}
            value={gitlabApi}
            onChange={(e) => setGitlabApi(e.target.value)}
          />
        </div>

        {/* 프로젝트 기간 입력 */}
        <div className={styles.dateSection}>
          <div>
            <label>프로젝트 시작일자:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="시작일 선택"
              className={styles.dateInput}
            />
          </div>
          <span className={styles.dateSeparator}>~</span>
          <div>
            <label>프로젝트 종료일자:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="종료일 선택"
              className={styles.dateInput}
            />
          </div>
        </div>

        {/* 수정 완료 및 취소 버튼 */}
        <div className={styles.buttonSection}>
          <button className={styles.saveButton} onClick={handleSave}>수정 완료</button>
          <button className={styles.cancelButton} onClick={handleCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectInfoModal;
