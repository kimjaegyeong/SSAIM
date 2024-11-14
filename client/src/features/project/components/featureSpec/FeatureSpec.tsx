import React, { useState, useEffect, useRef } from 'react';
import styles from './FeatureSpec.module.css';
import { MdDelete } from "react-icons/md";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getFeatureSpec, getAutoFeatureSpec } from '@features/project/apis/webSocket/featureSpec';
import CommonModal from '@components/modal/Modal';
import Button from '@components/button/Button';
import Loading from '@/components/loading/Loading';

interface FeatureSpecData {
  category: string[];
  functionName: string[];
  description: string[];
  owner: string[];
  priority: string[];
}

interface FeatureSpecTableProps {
  projectId: string;
  isWebSocketConnected: boolean;
}

const FeatureSpecTable: React.FC<FeatureSpecTableProps> = ({ projectId, isWebSocketConnected }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTextareaValue, setModalTextareaValue] = useState<string>('');
  const [data, setData] = useState<FeatureSpecData>({
    category: [],
    functionName: [],
    description: [],
    owner: [],
    priority: [],
  });

  const [isEditing, setIsEditing] = useState<{ [index: number]: { [field: string]: boolean } }>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    const fetchFeatureSpec = async () => {
      try {
        const fetchedData = await getFeatureSpec(projectId);
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching feature spec:', error);
      }
    };

    fetchFeatureSpec();
  }, [projectId]);

  useEffect(() => {
    if (isWebSocketConnected) {
      const socket = new SockJS('https://k11e203.p.ssafy.io:8080/ws');
      const stompClient = Stomp.over(socket);
      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
        const subscriptionPath = `/topic/api/v1/projects/${projectId}/function-description`;

        stompClient.subscribe(subscriptionPath, (message) => {
          try {
            const updatedData = JSON.parse(message.body);
            setData(updatedData);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });
      });

      return () => {
        if (stompClient.connected) {
          stompClient.disconnect(() => {
            console.log('WebSocket disconnected for FeatureSpecTable');
          });
        }
      };
    }
  }, [isWebSocketConnected, projectId]);

  const addNewRow = () => {
    // 열(column) 기반 데이터에 새로운 행 추가
    const updatedData = {
      category: [...data.category, ''],
      functionName: [...data.functionName, ''],
      description: [...data.description, ''],
      owner: [...data.owner, ''],
      priority: [...data.priority, ''],
    };

    setData(updatedData);

    // WebSocket으로 새로운 데이터 전송
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/function-description`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleDeleteRow = (index: number) => {
    // 각 컬럼 배열에서 특정 인덱스의 값 제거
    const updatedData = {
      category: data.category.filter((_, i) => i !== index),
      functionName: data.functionName.filter((_, i) => i !== index),
      description: data.description.filter((_, i) => i !== index),
      owner: data.owner.filter((_, i) => i !== index),
      priority: data.priority.filter((_, i) => i !== index),
    };

    setData(updatedData);

    // WebSocket으로 업데이트된 데이터 전송
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/function-description`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleInputChange = (column: keyof FeatureSpecData, rowIndex: number, value: string) => {
    const updatedColumn = [...data[column]];
    updatedColumn[rowIndex] = value;

    const updatedData = { ...data, [column]: updatedColumn };
    setData(updatedData);

    // WebSocket으로 업데이트된 데이터 전송
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/function-description`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleEditClick = (rowIndex: number, column: keyof FeatureSpecData) => {
    setIsEditing((prev) => ({
      ...prev,
      [rowIndex]: { ...prev[rowIndex], [column]: true },
    }));
  };

  const handleBlur = (rowIndex: number, column: keyof FeatureSpecData) => {
    setIsEditing((prev) => ({
      ...prev,
      [rowIndex]: { ...prev[rowIndex], [column]: false },
    }));
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    rowIndex: number,
    column: keyof FeatureSpecData
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur(rowIndex, column); // 엔터 키로 편집 종료
    }
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      autoResize(textarea as HTMLTextAreaElement);
    });
  }, [data]);
  
  const handleModalTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModalTextareaValue(e.target.value); // textarea 값 업데이트
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
      const response = await getAutoFeatureSpec(projectId, modalTextareaValue); // 데이터를 가져옴
      console.log('Fetched auto proposal data (raw):', response);
  
      let parsedData;
  
      // response가 문자열인지 확인
      if (typeof response === 'string') {
        console.log('Response is a string. Attempting to parse with parseBacktickJson.');
        parsedData = parseBacktickJson(response); // 백틱 JSON 처리
      } else if (typeof response === 'object') {
        console.log('Response is an object. Using it directly.');
        parsedData = response; // 객체 그대로 사용
      } else {
        console.error('Unexpected response type:', typeof response);
        parsedData = null;
      }
  
      // 파싱된 데이터를 상태에 반영
      if (parsedData) {
        const maxLength = Math.max(
          ...Object.values(parsedData).map((value) => Array.isArray(value) ? value.length : 0)
        );

        Object.keys(parsedData).forEach((key) => {
          if (Array.isArray(parsedData[key])) {
            while (parsedData[key].length < maxLength) {
              parsedData[key].push('');
            }
          }
        });

        parsedData.owner = Array(maxLength).fill(''),
        setData(parsedData);
  
        // WebSocket을 통해 실시간 반영
        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.send(
            `/app/edit/api/v1/projects/${projectId}/function-description`, // WebSocket 경로
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
      console.error('Error fetching auto proposal:', error);
      alert('자동 생성에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsGenerating(false);
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
    <div className={styles.tableContainer}>
      <div className={styles.aiButton}>
        <Button size='custom' colorType='purple' onClick={openModal}>AI 자동생성</Button>
      </div>
      <CommonModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        title= '기능명세서 자동 생성'
        content={
          <>
            {isGenerating && <Loading />}
            <textarea
              className={styles.modalTextarea}
              value={modalTextareaValue}
              onChange={handleModalTextareaChange}
            ></textarea>
          </>
        }
        footer={
          <Button size='custom' colorType='blue' onClick={handleModalSubmit}>
            AI 자동생성
          </Button>
        }
        width={800}
        height={400}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th>구분</th>
            <th>기능명</th>
            <th>내용</th>
            <th>담당자</th>
            <th>우선순위</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {data.category.map((_, index) => (
            <tr key={index}>
              {(['category', 'functionName', 'description', 'owner', 'priority'] as const).map((column) => (
                <td
                  key={column}
                  onClick={() => handleEditClick(index, column)}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {isEditing[index]?.[column] ? (
                    <textarea
                      value={data[column][index]}
                      onChange={(e) => handleInputChange(column, index, e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, index, column)} // 엔터 키 처리
                      onBlur={() => handleBlur(index, column)}
                      autoFocus
                      ref={(el) => el && autoResize(el)} // 크기 자동 조정
                    />
                  ) : (
                    data[column][index]
                  )}
                </td>
              ))}
              <td>
                <MdDelete onClick={() => handleDeleteRow(index)} />
              </td>
            </tr>
          ))}
          <tr className={styles.addRow} onClick={addNewRow}>
            <td colSpan={6} className={styles.addRowText}>
              + Add New Row
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FeatureSpecTable;
