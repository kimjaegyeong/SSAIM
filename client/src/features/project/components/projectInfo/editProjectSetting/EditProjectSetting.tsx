import styles from './EditProjectSetting.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from 'react';
import CheckModal from '@/components/checkModal/CheckModal';
import { fetchApiKey } from '@features/project/apis/fetchApiKey';
import { useProjectInfo } from '@/features/project/hooks/useProjectInfo';
interface EditProjectSettingProps {
  onClose: () => void;
  type: 'jira' | 'gitlab';
  projectId: number;
}

interface ModalContentItem {
  title: 'Jira' | 'GitLab';
  content: 'jira' | 'gitlab';
}

const modalContent: Record<'jira' | 'gitlab', ModalContentItem> = {
  jira: {
    title: 'Jira',
    content: 'jira',
  },
  gitlab: {
    title: 'GitLab',
    content: 'gitlab',
  },
};

const EditProjectSetting: React.FC<EditProjectSettingProps> = ({ onClose, type, projectId }) => {
  const modalData = modalContent[type];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [externalProjectId, setExternalProjectId] = useState<string>('');
  const { data: projectInfo } = useProjectInfo(projectId);

  const existingApiKey = type === 'jira' ? projectInfo?.jiraApi : projectInfo?.gitlabApi;

  useEffect(() => {
    if (existingApiKey) {
      setApiKey('**********'); // 초기값을 숨겨진 형태로 설정
    }
  }, [existingApiKey]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleSave = async () => {
    const apiKeyPayload =
      type === 'jira'
        ? { jiraApi: apiKey, jiraProjectId: externalProjectId }
        : { gitlabApi: apiKey, gitlabProjectId: externalProjectId };
    console.log(apiKeyPayload);
    await fetchApiKey(modalData.content, 'patch', apiKeyPayload, projectId);
  };

  const handleCancel = () => {
    // 취소 로직
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.title}>{modalData.title} API Key 수정</div>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.bodyLeft}>
            <p>{modalData?.title}</p>
          </div>
          <div className={styles.bodyRight}>
            <input
              type="text"
              placeholder={`${modalData.content} Project Id`}
              className={styles.input}
              value={externalProjectId}
              onChange={(e) => setExternalProjectId(e.target.value)}
            />
            <input
              type="text"
              placeholder={`${modalData.content} API Key`}
              className={styles.input}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.saveButton} onClick={handleModalOpen}>
            저장
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
      <CheckModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        title="API Key 수정"
        content="저장하시겠습니까?"
        onConfirm={handleSave}
        confirmContent="저장"
      />
    </div>
  );
};

export default EditProjectSetting;
