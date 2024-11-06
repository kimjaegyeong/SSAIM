import styles from './EditProjectSetting.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState } from 'react';
import CheckModal from '@/components/checkModal/CheckModal';
interface EditProjectSettingProps {
  onClose: () => void;
  type: 'jira' | 'gitlab';
}

const modalContent = {
  jira: {
    title: 'Jira',
    content: 'jira',
  },
  gitlab: {
    title: 'GitLab',
    content: 'gitlab',
  },
};

const EditProjectSetting: React.FC<EditProjectSettingProps> = ({ onClose, type }) => {
  const modalData = modalContent[type];
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(modalData);
  const handleSave = () => {
    // 수정 완료 로직
    setIsModalOpen(true);
    console.log('modalopen')
  };

  const handleCancel = () => {
    // 취소 로직
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.title}>{modalData?.title} API Key 수정</div>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.bodyLeft}>
            <p>{modalData?.title}</p>
          </div>
          <div className={styles.bodyRight}>
            <input type="text" placeholder={`${modalData?.content} API Key`} className={styles.input} />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.saveButton} onClick={handleSave}>
            저장
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
      <CheckModal
        isOpen={isModalOpen}
        onClose={onClose}
        title="API Key 수정"
        content="저장하시겠습니까?"
        onConfirm={() => {
          console.log('저장하기누름!');
        }}
        confirmContent='저장'
      />
    </div>
  );
};

export default EditProjectSetting;
