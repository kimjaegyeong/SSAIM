import React, { useState, useEffect, useRef } from 'react';
import styles from './Proposal.module.css';
import { sendMessage } from '@features/project/apis/webSocket/webSocketService';
import { getProposal, getAutoProposal } from '@features/project/apis/webSocket/proposal';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import CommonModal from '@components/modal/Modal';
import Button from '@components/button/Button';
import Loading from '@/components/loading/Loading';
import { showToast } from '@/utils/toastUtils';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [modalTextareaValue, setModalTextareaValue] = useState<string>('');
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

  const maxCharCount = 200;

  const handleModalTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxCharCount) {
      setModalTextareaValue(e.target.value);
    }
  };

  const parseBacktickJson = (data: string) => {
    // 백틱과 "```json" 태그 제거
    const cleanedData = data.replace(/```json|```/g, "").trim();
    
    try {
      // JSON 문자열을 객체로 변환
      const parsedData = JSON.parse(cleanedData);
      return parsedData;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null; // 파싱 실패 시 null 반환
    }
  };

  const handleModalSubmit = async () => {
    try {
      setIsGenerating(true);
      let response;
      try {
        response = await getAutoProposal(projectId, modalTextareaValue);
      } catch (fetchError) {
        showToast.error('자동 생성에 실패했습니다. 다시 시도해 주세요.');
        return;
      }
  
      let parsedData;
      
      // response가 문자열인지 확인
      if (typeof response === 'string') {
        parsedData = parseBacktickJson(response); // 백틱 JSON 처리
      } else if (typeof response === 'object') {
        parsedData = response; // 객체 그대로 사용
      } else {
        console.error('Unexpected response type:', typeof response);
        parsedData = null;
      }

      console.log('parsedData : ', parsedData)

      Object.keys(parsedData).forEach((key) => {
        if (typeof parsedData[key] === 'object') {
          parsedData[key] = Object.entries(parsedData[key])
            .map(([subKey, subValue]) => `${subKey}: ${subValue}`)
            .join('\n');
        }
      });
  
      // 파싱된 데이터를 상태에 반영
      if (parsedData) {
        setEditableData({
          title: parsedData.title || '',
          description: parsedData.description || '',
          background: parsedData.background || '',
          feature: parsedData.feature || '',
          effect: parsedData.effect || '',
        });
  
        // WebSocket을 통해 실시간 반영
        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.send(
            `/app/edit/api/v1/projects/${projectId}/proposal`, // WebSocket 경로
            {}, // 헤더
            JSON.stringify(parsedData) // WebSocket으로 데이터 전송
          );
          console.log('WebSocket message sent:', parsedData);
        } else {
          console.warn('WebSocket is not connected. Cannot send message.');
        }
      } else {
        console.error('Parsed data is null or undefined.');
      }
  
      setIsModalOpen(false); // 모달 닫기
    } catch (error) {
      showToast.error('AI가 요청을 이해하지 못했습니다. 요청을 확인해주세요.')
    } finally {
      setIsGenerating(false); // 로딩 종료
    }
  };
  
  const openModal = () => {
    setModalTextareaValue('')
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.proposal}>
      <h2 className={styles.sectionTitle}>
        프로젝트 기획서
        <div className={styles.aiButton}>
          <Button size='custom' colorType='purple' onClick={openModal}>AI 자동생성</Button>
        </div>
      </h2>
      <CommonModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        title= '기획서 자동 생성'
        content={
          <>
            {isGenerating && <Loading />}
            <textarea
              className={styles.modalTextarea}
              value={modalTextareaValue}
              onChange={handleModalTextareaChange}
            ></textarea>
            <div className={styles.charCounter}>
              {modalTextareaValue.length} / {maxCharCount}
            </div>
          </>
        }
        footer={
          <Button size='custom' colorType='blue' onClick={handleModalSubmit}>
            AI 자동생성
          </Button>
        }
        width={800}
        height={400}
        isOutsideClick={false}
      />
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
                    {field === 'description' && '서비스 소개'}
                    {field === 'background' && '기획 배경'}
                    {field === 'feature' && '주요기능'}
                    {field === 'effect' && '기대효과'}
                  </td>
                  <td
                    className={styles.content}
                    onClick={() => !isEditing[field] && toggleEdit(field)}
                    style={{ 
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordWrap: 'break-word',
                      wordBreak: 'break-word',
                    }}
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
