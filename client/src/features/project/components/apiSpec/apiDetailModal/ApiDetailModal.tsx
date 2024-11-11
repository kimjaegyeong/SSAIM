import React, { useState, useRef, useEffect } from 'react';
import styles from './ApiDetailModal.module.css';

interface ApiDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  rowIndex: number;
  setData: (data: any) => void;
  projectId: string;
  stompClient: any;
}

const ApiDetailModal: React.FC<ApiDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  rowIndex,
  setData,
  projectId,
  stompClient,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Key 이름 매핑
  const keyMappings: Record<string, string> = {
    category: '분류',
    uri: 'URI',
    feOwner: 'FE 담당',
    beOwner: 'BE 담당',
    feStatus: 'FE 개발상태',
    beStatus: 'BE 개발상태',
    priority: '우선순위',
  };

  useEffect(() => {
    if (editingField && inputRefs.current[editingField]) {
      inputRefs.current[editingField]?.focus();
    }
  }, [editingField]);

  const handleInputChange = (column: string, value: string) => {
    const updatedColumn = [...data[column]];
    updatedColumn[rowIndex] = value;

    const updatedData = { ...data, [column]: updatedColumn };
    setData(updatedData);

    if (stompClient?.connected) {
      stompClient.send(
        `/app/edit/api/v1/projects/${projectId}/api-docs`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleFieldClick = (key: string) => {
    setEditingField(key);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // 편집 중인 영역을 클릭하지 않았다면 종료
    if (!target.closest(`.${styles.valueTextarea}`) && !target.closest(`.${styles.valueText}`)) {
      setEditingField(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!isOpen || rowIndex === null) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          className={styles.descriptionTextarea}
          value={data.description[rowIndex]}
          placeholder="API 이름을 입력하세요."
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        <div className={styles.keyValueList}>
          {Object.keys(data).map((key) =>
            !['requestHeader', 'requestBody', 'responseHeader', 'responseBody', 'description'].includes(key) ? (
              <div key={key} className={styles.keyValueRow}>
                <span className={styles.key}>{keyMappings[key] || key}</span>
                {editingField === key ? (
                  <input
                    ref={(el) => (inputRefs.current[key] = el)}
                    className={styles.valueTextarea}
                    value={data[key][rowIndex]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                ) : (
                  <span
                    className={`${styles.valueText} ${!data[key][rowIndex] ? styles.placeholder : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFieldClick(key);
                    }}
                  >
                    {data[key][rowIndex] ? data[key][rowIndex] : '비어 있음'}
                  </span>
                )}
              </div>
            ) : null
          )}
        </div>
        <div className={styles.bodyContainer}>
          {['requestHeader', 'requestBody', 'responseHeader', 'responseBody'].map((key) => (
            <div key={key} className={styles.bodySection}>
              <h3 className={styles.bodyTitle}>{key}</h3>
              <textarea
                className={styles.bodyTextarea}
                value={data[key][rowIndex]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                onInput={(e) => {
                  const textarea = e.target as HTMLTextAreaElement;
                  textarea.style.height = 'auto';
                  textarea.style.height = `${textarea.scrollHeight}px`;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiDetailModal;
