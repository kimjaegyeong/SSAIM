import { useSprintListData } from '@/features/project/hooks/useSprintListData';
import styles from './SprintList.module.css';
import React, { useState } from 'react';
import { SprintDTO, SprintCreateDTO } from '@/features/project/types/SprintDTO';
import { useNavigate } from 'react-router-dom';
import SprintCreateModal from './SprintCreateModal';
import { useCreateSprint } from '@/features/project/hooks/useCreateSprint';

interface SprintListProps {
  projectId: number;
}

const SprintList: React.FC<SprintListProps> = ({ projectId }) => {
  const { data: sprintList } = useSprintListData(projectId);
  const { mutate: createSprint } = useCreateSprint(projectId);

  const navigate = useNavigate();
  const navigateToCreate = (sprintId: number) => () => {
    navigate(`/project/${projectId}/sprint/${sprintId}`);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 모달 열기/닫기
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleCreateSprint = (data: SprintCreateDTO) => {
    createSprint(data, {
      onSuccess: () => {
        console.log('New sprint created:', data);
        closeModal();
      },
      onError: (error) => {
        console.error('스프린트 생성 오류:', error);
      },
    });
  };

  return (
    <div className={styles.sprintListContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <h2>스프린트 목록</h2>
        <button className={styles.createSprintButton} onClick={openModal}>
          새 스프린트 생성
        </button>
      </div>

      {/* Body Section */}
      {sprintList && sprintList.length > 0 ? (
        <table className={styles.sprintTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {sprintList.map((sprint: SprintDTO) => (
              <tr key={sprint.sprintId} onClick={navigateToCreate(sprint.sprintId)}>
                <td>{sprint.sprintId}</td>
                <td>{sprint.name}</td>
                <td>{new Date(sprint.startDate).toLocaleDateString()}</td>
                <td>{new Date(sprint.endDate).toLocaleDateString()}</td>
                <td className={sprint.state === 'active' ? styles.active : styles.closed}>
                  {sprint.state === 'active' ? '진행 중' : '완료됨'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.emptyMessage}>스프린트가 없습니다. 새 스프린트를 생성해보세요!</p>
      )}
      {isModalOpen && <SprintCreateModal onClose={closeModal} onCreate={handleCreateSprint} />}
    </div>
  );
};

export default SprintList;
