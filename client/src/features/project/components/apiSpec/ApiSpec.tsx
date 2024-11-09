import React, { useState, useEffect, useRef } from 'react';
import styles from './ApiSpec.module.css';
import { MdDelete } from "react-icons/md";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getApiSpec } from '@features/project/apis/webSocket/apiSpec';

interface ApiSpecData {
  category: string[];
  description: string[];
  url: string[];
  method: string[];
  frontOwner: string[];
  backOwner: string[];
  frontState: string[];
  backState: string[];
  priority: string[];
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
    description: [],
    url: [],
    method: [],
    frontOwner: [],
    backOwner: [],
    frontState: [],
    backState: [],
    priority: [],
    requestHeader: [],
    responseHeader: [],
    requestBody: [],
    responseBody: [],
  });
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const stompClientRef = useRef<any>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node) &&
        expandedRow !== null
      ) {
        setExpandedRow(null); // 외부 클릭 시 확장 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedRow]);

  const addNewRow = () => {
    const updatedData = {
      ...data,
      category: [...data.category, ''],
      description: [...data.description, ''],
      url: [...data.url, ''],
      method: [...data.method, ''],
      frontOwner: [...data.frontOwner, ''],
      backOwner: [...data.backOwner, ''],
      frontState: [...data.frontState, ''],
      backState: [...data.backState, ''],
      priority: [...data.priority, ''],
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
      description: data.description.filter((_, i) => i !== index),
      url: data.url.filter((_, i) => i !== index),
      method: data.method.filter((_, i) => i !== index),
      frontOwner: data.frontOwner.filter((_, i) => i !== index),
      backOwner: data.backOwner.filter((_, i) => i !== index),
      frontState: data.frontState.filter((_, i) => i !== index),
      backState: data.backState.filter((_, i) => i !== index),
      priority: data.priority.filter((_, i) => i !== index),
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

  const handleRowClick = (rowIndex: number) => {
    if (expandedRow !== rowIndex) {
      setExpandedRow(rowIndex); // 클릭한 row 확장
    }
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setExpandedRow(null); // Enter 키로 수정 종료 및 확장 닫기
    }
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

  return (
    <div className={styles.tableContainer} ref={tableRef}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>분류</th>
            <th>설명</th>
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
              <tr onClick={() => handleRowClick(index)}>
                {(['category', 'description', 'url', 'method', 'frontOwner', 'backOwner', 'frontState', 'backState', 'priority'] as const).map((column) => (
                  <td key={column}>
                    {expandedRow === index ? (
                      <textarea
                        value={data[column][index]}
                        onChange={(e) => handleInputChange(column, index, e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e)} // Enter 키 처리
                        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 버블링 방지
                        ref={(el) => el && autoResize(el)}
                        rows={1}
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
              {expandedRow === index && (
                <tr className={styles.expandedRow}>
                  <td colSpan={10}>
                    <div className={styles.expandedContent}>
                      <table>
                        <thead>
                          <tr>
                            <th>요청 헤더</th>
                            <th>응답 헤더</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <textarea
                                value={data.requestHeader[index]}
                                onChange={(e) =>
                                  handleInputChange('requestHeader', index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyPress(e)} // Enter 처리
                                onClick={(e) => e.stopPropagation()} // 클릭 버블링 방지
                                ref={(el) => el && autoResize(el)}
                              />
                            </td>
                            <td>
                              <textarea
                                value={data.responseHeader[index]}
                                onChange={(e) =>
                                  handleInputChange('responseHeader', index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyPress(e)} // Enter 처리
                                onClick={(e) => e.stopPropagation()} // 클릭 버블링 방지
                                ref={(el) => el && autoResize(el)}
                              />
                            </td>
                          </tr>
                        </tbody>
                        <thead>
                          <tr>
                            <th>요청 바디</th>
                            <th>응답 바디</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <textarea
                                value={data.requestBody[index]}
                                onChange={(e) =>
                                  handleInputChange('requestBody', index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyPress(e)} // Enter 처리
                                onClick={(e) => e.stopPropagation()} // 클릭 버블링 방지
                                ref={(el) => el && autoResize(el)}
                              />
                            </td>
                            <td>
                              <textarea
                                value={data.responseBody[index]}
                                onChange={(e) =>
                                  handleInputChange('responseBody', index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyPress(e)} // Enter 처리
                                onClick={(e) => e.stopPropagation()} // 클릭 버블링 방지
                                ref={(el) => el && autoResize(el)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          <tr className={styles.addRow} onClick={addNewRow}>
            <td colSpan={10}>+ Add New Row</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ApiSpecTable;
