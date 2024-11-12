import React, { useState } from 'react';
import { SprintCreateDTO } from '@/features/project/types/SprintDTO';
import styles from './SprintCreateModal.module.css';

interface SprintCreateModalProps {
  onClose: () => void;
  onCreate: (data: SprintCreateDTO) => void;
}

const SprintCreateModal: React.FC<SprintCreateModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState<SprintCreateDTO>({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    goals: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'startDate' || name === 'endDate' ? new Date(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>새 스프린트 생성</h3>
        <form onSubmit={handleSubmit}>
          <label>
            이름:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </label>
          <label>
            시작일:
            <input
              type="date"
              name="startDate"
              value={formData.startDate.toISOString().substring(0, 10)}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </label>
          <label>
            종료일:
            <input
              type="date"
              name="endDate"
              value={formData.endDate.toISOString().substring(0, 10)}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </label>
          <label>
            목표:
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              required
              className={styles.textArea}
            />
          </label>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>생성</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SprintCreateModal;
