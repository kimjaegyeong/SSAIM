import React, { useState, useEffect } from 'react';
import styles from './Proposal.module.css';
import { subscribeToPath, sendMessage } from '@features/project/apis/webSocket/webSocketService';
import { getProposal } from '@features/project/apis/webSocket/proposal';

interface ProposalProps {
  projectId: string;
  isWebSocketConnected: boolean;
}

interface EditableData {
  title: string;
  description: string;
  background: string;
  feature: string;
  effect: string;
}

const Proposal: React.FC<ProposalProps> = ({ projectId, isWebSocketConnected }) => {
  const [editableData, setEditableData] = useState<EditableData>({
    title: '',
    description: '',
    background: '',
    feature: '',
    effect: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState({
    title: false,
    description: false,
    background: false,
    feature: false,
    effect: false,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching initial data...');
        const data = await getProposal(projectId);
        console.log('Data received:', data);
        setEditableData(data);
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isWebSocketConnected) {
      const subscriptionPath = `/topic/api/v1/projects/${projectId}/proposal`;
  
      subscribeToPath(subscriptionPath, (data) => {
        setEditableData((prevData) => ({ ...prevData, ...data }));
      });
  
      fetchInitialData();
    }
  }, [isWebSocketConnected, projectId]);

  const handleFieldChange = (field: keyof EditableData, value: string) => {
    // 상태 업데이트
    setEditableData((prev) => {
      const updatedData = { ...prev, [field]: value };
  
      // WebSocket 연결 여부 확인 후 전체 데이터 전송
      if (isWebSocketConnected) {
        sendMessage(`/app/edit/api/v1/projects/${projectId}/proposal`, updatedData);
      } else {
        console.warn("WebSocket is not connected. Cannot send message.");
      }
  
      return updatedData; // 업데이트된 데이터를 반환
    });
  };

  const toggleEdit = (field: keyof EditableData) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const autoResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>, field: keyof EditableData) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      toggleEdit(field);
    }
  };

  return (
    <div className={styles.proposal}>
      <h2 className={styles.sectionTitle}>프로젝트 정보</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.infoTable}>
          <tbody>
            {Object.entries(editableData).map(([key, value]) => {
              const field = key as keyof EditableData;
              return (
                <tr key={field}>
                  <td className={styles.label}>
                    {field === 'title' && '서비스명'}
                    {field === 'description' && '서비스 한줄 소개'}
                    {field === 'background' && '기획 배경'}
                    {field === 'feature' && '주요기능'}
                    {field === 'effect' && '기대효과'}
                  </td>
                  <td
                    className={styles.content}
                    onClick={() => !isEditing[field] && toggleEdit(field)}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {isEditing[field] ? (
                      <textarea
                        className={styles.inputTextarea}
                        value={value}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        onBlur={() => toggleEdit(field)}
                        autoFocus
                        ref={(el) => el && autoResize(el)}
                        onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                        onKeyDown={(e) => handleKeyPress(e, field)}
                      ></textarea>
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Proposal;
