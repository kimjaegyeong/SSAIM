import React, { useState, useEffect, useRef } from 'react';
import styles from './ApiSpec.module.css';
import { MdDelete } from "react-icons/md";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getApiSpec, getAutoApiSpec } from '@features/project/apis/webSocket/apiSpec';
import ApiDetailModal from './apiDetailModal/ApiDetailModal';
import CommonModal from '@components/modal/Modal';
import Button from '@components/button/Button';

interface ApiSpecData {
  category: string[];
  functionName: string[];
  uri: string[];
  method: string[];
  frontOwner: string[];
  backOwner: string[];
  frontState: string[];
  backState: string[];
  priority: string[];
  description: string[];
  requestHeader: string[];
  responseHeader: string[];
  requestBody: string[];
  responseBody: string[];
}

interface ApiSpecTableProps {
  projectId: string;
  isWebSocketConnected: boolean;
}

const ApiSpecTable: React.FC<ApiSpecTableProps> = ({ projectId, isWebSocketConnected }) => {
  const [data, setData] = useState<ApiSpecData>({
    category: [],
    functionName: [],
    uri: [],
    method: [],
    frontOwner: [],
    backOwner: [],
    frontState: [],
    backState: [],
    priority: [],
    description: [],
    requestHeader: [],
    responseHeader: [],
    requestBody: [],
    responseBody: [],
  });
  const tableRef = useRef<HTMLDivElement | null>(null);
  const stompClientRef = useRef<any>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [modalTextareaValue, setModalTextareaValue] = useState<string>('');

  const openModal = (rowIndex: number) => {
    setSelectedRowIndex(rowIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRowIndex(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchApiSpec = async () => {
      try {
        const fetchedData = await getApiSpec(projectId);
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching api spec:', error);
      }
    };

    fetchApiSpec();
  }, [projectId]);

  useEffect(() => {
    if (isWebSocketConnected) {
      const socket = new SockJS('https://k11e203.p.ssafy.io:8080/ws');
      const stompClient = Stomp.over(socket);
      stompClientRef.current = stompClient;

      stompClient.connect({}, () => {
        const subscriptionPath = `/topic/api/v1/projects/${projectId}/api-docs`;

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
            console.log('WebSocket disconnected for ApiSpecTable');
          });
        }
      };
    }
  }, [isWebSocketConnected, projectId]);

  const addNewRow = () => {
    const updatedData = {
      ...data,
      category: [...data.category, ''],
      functionName: [...data.functionName, ''],
      uri: [...data.uri, ''],
      method: [...data.method, ''],
      frontOwner: [...data.frontOwner, ''],
      backOwner: [...data.backOwner, ''],
      frontState: [...data.frontState, ''],
      backState: [...data.backState, ''],
      priority: [...data.priority, ''],
      description: [...data.description, ''],
      requestHeader: [...data.requestHeader, ''],
      responseHeader: [...data.responseHeader, ''],
      requestBody: [...data.requestBody, ''],
      responseBody: [...data.responseBody, ''],
      // category: [''],
      // functionName: [''],
      // uri: [''],
      // method: [''],
      // frontOwner: [''],
      // backOwner: [''],
      // frontState: [''],
      // backState: [''],
      // priority: [''],
      // description: [''],
      // requestHeader: [''],
      // responseHeader: [''],
      // requestBody: [''],
      // responseBody: [''],
    };

    setData(updatedData);

    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/api-docs`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleDeleteRow = (index: number) => {
    const updatedData = {
      category: data.category.filter((_, i) => i !== index),
      functionName: data.functionName.filter((_, i) => i !== index),
      uri: data.uri.filter((_, i) => i !== index),
      method: data.method.filter((_, i) => i !== index),
      frontOwner: data.frontOwner.filter((_, i) => i !== index),
      backOwner: data.backOwner.filter((_, i) => i !== index),
      frontState: data.frontState.filter((_, i) => i !== index),
      backState: data.backState.filter((_, i) => i !== index),
      priority: data.priority.filter((_, i) => i !== index),
      description: data.description.filter((_, i) => i !== index),
      requestHeader: data.requestHeader.filter((_, i) => i !== index),
      responseHeader: data.responseHeader.filter((_, i) => i !== index),
      requestBody: data.requestBody.filter((_, i) => i !== index),
      responseBody: data.responseBody.filter((_, i) => i !== index),
    };

    setData(updatedData);

    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/api-docs`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

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
      const response = await getAutoApiSpec(projectId, modalTextareaValue); // 데이터를 가져옴
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
        parsedData.frontOwner = Array(parsedData.functionName.length).fill(''),
        parsedData.backOwner = Array(parsedData.functionName.length).fill(''),
        parsedData.frontState = Array(parsedData.functionName.length).fill(''),
        parsedData.backState = Array(parsedData.functionName.length).fill(''),
        parsedData.requestHeader = Array(parsedData.functionName.length).fill(''),
        parsedData.responseHeader = Array(parsedData.functionName.length).fill(''),
        parsedData.requestBody = Array(parsedData.functionName.length).fill(''),
        parsedData.responseBody = Array(parsedData.functionName.length).fill(''),
        setData(parsedData);
  
        // WebSocket을 통해 실시간 반영
        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.send(
            `/app/edit/api/v1/projects/${projectId}/api-docs`, // WebSocket 경로
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
    }
  };

  const openAiModal = () => {
    setModalTextareaValue('')
    setIsAiModalOpen(true);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
  };

  return (
    <div className={styles.tableContainer} ref={tableRef}>
      <div className={styles.aiButton}>
        <Button size='custom' colorType='purple' onClick={openAiModal}>AI 자동생성</Button>
      </div>
      <CommonModal 
        isOpen={isAiModalOpen}
        onClose={closeAiModal}
        title= '기능명세서 자동 생성'
        content={
          <textarea
            className={styles.modalTextarea}
            value={modalTextareaValue}
            onChange={handleModalTextareaChange}
          ></textarea>
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
            <th>분류</th>
            <th>API 이름</th>
            <th>URI</th>
            <th>메소드</th>
            <th>FE 담당</th>
            <th>BE 담당</th>
            <th>FE 상태</th>
            <th>BE 상태</th>
            <th>우선순위</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {data.category.map((_, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => openModal(index)}>
                {(['category', 'functionName', 'uri', 'method', 'frontOwner', 'backOwner', 'frontState', 'backState', 'priority'] as const).map((column) => (
                  <td key={column}>
                    {data[column][index]}
                  </td>
                ))}
                <td>
                <MdDelete
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 버블링 방지
                    handleDeleteRow(index);
                  }}
                />
                </td>
              </tr>
            </React.Fragment>
          ))}
          <tr className={styles.addRow} onClick={addNewRow}>
            <td colSpan={10}>+ Add New Row</td>
          </tr>
        </tbody>
      </table>
      {isModalOpen && selectedRowIndex !== null && (
        <ApiDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          data={data}
          rowIndex={selectedRowIndex}
          setData={setData}
          projectId={projectId}
          stompClient={stompClientRef.current}
        />
      )}
    </div>
  );
};

export default ApiSpecTable;
