import React, { useState, useEffect } from 'react';
import styles from './Proposal.module.css'; 

const Proposal: React.FC = () => {
  const [editableData, setEditableData] = useState({
    serviceName: '',
    serviceDescription: '',
    background: '',
    mainFeatures: '',
    expectedEffect: '',
  });

  const [isEditing, setIsEditing] = useState({
    serviceName: false,
    serviceDescription: false,
    background: false,
    mainFeatures: false,
    expectedEffect: false,
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>, field: keyof typeof editableData) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur(field);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        serviceName: '프로젝트 제목',
        serviceDescription: '프로젝트 한줄 소개',
        background: '프로젝트 배경 설명',
        mainFeatures: '주요기능',
        expectedEffect: '기대효과',
      };
      setEditableData(data);
    };

    fetchData();
  }, []);

  const handleChange = (field: keyof typeof editableData, value: string) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof typeof editableData) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    console.log(`저장 요청: ${field}`, editableData[field]);
  };

  const handleEditClick = (field: keyof typeof editableData) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className={styles.proposal}>
      <h2 className={styles.sectionTitle}>프로젝트 정보</h2>
      <table className={styles.infoTable}>
        <tbody>
          {Object.keys(editableData).map((key) => {
            const field = key as keyof typeof editableData;
            return (
              <tr key={field}>
                <td className={styles.label}>
                  {field === 'serviceName' && '서비스명'}
                  {field === 'serviceDescription' && '서비스 한줄 소개'}
                  {field === 'background' && '기획 배경'}
                  {field === 'mainFeatures' && '주요기능'}
                  {field === 'expectedEffect' && '기대효과'}
                </td>
                <td
                  className={styles.content}
                  onClick={() => !isEditing[field] && handleEditClick(field)}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {isEditing[field] ? (
                    <textarea
                      className={styles.inputTextarea}
                      value={editableData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      onBlur={() => handleBlur(field)}
                      autoFocus
                      ref={(el) => el && autoResize(el)}
                      onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                      onKeyDown={(e) => handleKeyPress(e, field)}
                    ></textarea>
                  ) : (
                    editableData[field]
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Proposal;
