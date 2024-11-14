import React, { useState, useEffect, useRef } from 'react';
import styles from './ApiSpec.module.css';
import { MdDelete } from "react-icons/md";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getApiSpec, getAutoApiSpec } from '@features/project/apis/webSocket/apiSpec';
import ApiDetailModal from './apiDetailModal/ApiDetailModal';
import CommonModal from '@components/modal/Modal';
import Button from '@components/button/Button';
import Tag from '@/features/teamBuilding/components/tag/Tag';
import { getApiStatusLabel } from '../../../../utils/labelUtils'
import { MdOpenInNew } from "react-icons/md";
import Loading from '@/components/loading/Loading';

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
  const [isEditing, setIsEditing] = useState<{ [rowIndex: number]: { [column: string]: boolean } }>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

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
      method: [...data.method, 'GET'],
      frontOwner: [...data.frontOwner, ''],
      backOwner: [...data.backOwner, ''],
      frontState: [...data.frontState, '0'],
      backState: [...data.backState, '0'],
      priority: [...data.priority, ''],
      description: [...data.description, ''],
      requestHeader: [...data.requestHeader, ''],
      responseHeader: [...data.responseHeader, ''],
      requestBody: [...data.requestBody, ''],
      responseBody: [...data.responseBody, ''],
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
      setIsGenerating(true);
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

        parsedData.frontOwner = Array(maxLength).fill(''),
        parsedData.backOwner = Array(maxLength).fill(''),
        parsedData.frontState = Array(maxLength).fill('0'),
        parsedData.backState = Array(maxLength).fill('0'),
        parsedData.requestHeader = Array(maxLength).fill(''),
        parsedData.responseHeader = Array(maxLength).fill(''),
        parsedData.requestBody = Array(maxLength).fill(''),
        parsedData.responseBody = Array(maxLength).fill(''),
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
      alert('자동 생성에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsGenerating(false); // 로딩 종료
    }
  };

  const openAiModal = () => {
    setModalTextareaValue('')
    setIsAiModalOpen(true);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
  };

  const handleEditClick = (rowIndex: number, column: keyof ApiSpecData) => {
    setIsEditing({ [rowIndex]: { [column]: true } });
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleInputChange = (column: keyof ApiSpecData, rowIndex: number, value: string) => {
    const updatedColumn = [...data[column]];
    updatedColumn[rowIndex] = value;
  
    const updatedData = { ...data, [column]: updatedColumn };
    setData(updatedData);
  
    if (stompClientRef.current?.connected) {
      stompClientRef.current.send(
        `/app/edit/api/v1/projects/${projectId}/api-docs`,
        {},
        JSON.stringify(updatedData)
      );
    }
  };

  const handleBlur = () => {
    setIsEditing({});
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
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
            <th className={styles.actionColumn}></th> {/* 빈 열 추가 */}
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
              <tr>
                <td className={styles.actionCell}>
                  <MdOpenInNew
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(index);
                    }}
                    className={styles.actionButton}
                  />
                </td>
                {(['category', 'functionName', 'uri', 'method', 'frontOwner', 'backOwner', 'frontState', 'backState', 'priority'] as const).map((column) => (
                  <td
                    key={column}
                    onClick={() => handleEditClick(index, column)} // <td> 클릭 시 편집 모드 진입
                    className={styles.tableCell}
                  >
                    {column === 'frontState' || column === 'backState' ? (
                      <>
                        {/* 기존 Tag 표시 */}
                        <div className={styles.tagWrapper}>
                          <Tag text={getApiStatusLabel(parseInt(data[column][index]))} />
                        </div>

                        {/* 수정 모드: 선택 가능한 태그 목록 */}
                        {isEditing[index]?.[column] && (
                          <div
                            className={styles.tagOptions}
                            onClick={(e) => e.stopPropagation()} // 클릭 이벤트 버블링 방지
                          >
                            {[0, 1, 2].map((value) => (
                              <div
                                key={value}
                                onClick={() => {
                                  handleInputChange(column, index, value.toString());
                                  handleBlur(); // 선택 후 편집 종료
                                }}
                                className={styles.tagOptionWrapper}
                              >
                                <Tag text={getApiStatusLabel(value)} />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : column === 'method' ? ( 
                      <>
                        {/* 기존 Tag 표시 */}
                        <div className={styles.tagWrapper}>
                          <Tag text={data[column][index]} />
                        </div>

                        {/* 수정 모드: 선택 가능한 태그 목록 */}
                        {isEditing[index]?.[column] && (
                          <div
                            className={styles.tagOptions}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((value) => (
                              <div
                                key={value}
                                onClick={() => {
                                  handleInputChange(column, index, value);
                                  handleBlur(); // 선택 후 편집 종료
                                }}
                                className={styles.tagOptionWrapper}
                              >
                                <Tag text={value} />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : isEditing[index]?.[column] ? (
                      // 편집 모드: 텍스트 에디터
                      <textarea
                        value={data[column][index]}
                        onChange={(e) => handleInputChange(column, index, e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e)}
                        onBlur={() => handleBlur()}
                        autoFocus
                        ref={(el) => el && autoResize(el)}
                        className={styles.editTextarea}
                      />
                    ) : (
                      // 보기 모드: 일반 텍스트
                      data[column][index]
                    )}
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
            <td colSpan={11} className={styles.addRowTd}>+ Add New Row</td> {/* colspan을 11로 조정 */}
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
