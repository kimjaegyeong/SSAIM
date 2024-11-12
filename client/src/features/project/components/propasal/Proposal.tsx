import React, { useState, useEffect, useRef } from 'react';
import styles from './Proposal.module.css';
import { sendMessage } from '@features/project/apis/webSocket/webSocketService';
import { getProposal } from '@features/project/apis/webSocket/proposal';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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

  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await getProposal(projectId);

        const filledData = {
          title: data.title || '',
          description: data.description || '',
          background: data.background || '',
          feature: data.feature || '',
          effect: data.effect || '',
        };

        setEditableData(filledData);
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isWebSocketConnected) {
      const socket = new SockJS('https://k11e203.p.ssafy.io:8080/ws');
      const stompClient = Stomp.over(socket);
      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
        console.log('WebSocket connected');
        const subscriptionPath = `/topic/api/v1/projects/${projectId}/proposal`;

        stompClient.subscribe(subscriptionPath, (message) => {
          try {
            const data = JSON.parse(message.body);
            console.log('Received message:', data);

            setEditableData((prevData) => ({
              ...prevData,
              title: data.title || prevData.title,
              description: data.description || prevData.description,
              background: data.background || prevData.background,
              feature: data.feature || prevData.feature,
              effect: data.effect || prevData.effect,
            }));
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });
      });

      fetchInitialData();

      return () => {
        if (stompClientRef.current?.connected) {
          stompClientRef.current.disconnect(() => {
            console.log('WebSocket disconnected');
          });
        }
      };
    }
  }, [isWebSocketConnected, projectId]);

  const handleFieldChange = (field: keyof EditableData, value: string) => {
    setEditableData((prev) => {
      const updatedData = { ...prev, [field]: value };

      if (stompClientRef.current && stompClientRef.current.connected) {
        sendMessage(`/app/edit/api/v1/projects/${projectId}/proposal`, updatedData);
      } else {
        console.warn('WebSocket is not connected. Cannot send message.');
      }

      return updatedData;
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
                      <div
                        className={styles.readOnly}
                      >
                        {value}
                      </div>
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
