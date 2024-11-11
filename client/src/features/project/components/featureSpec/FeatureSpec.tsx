import React, { useState, useEffect, useRef } from 'react';
import styles from './FeatureSpec.module.css';
import { MdDelete } from "react-icons/md";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getFeatureSpec } from '@features/project/apis/webSocket/featureSpec';

interface FeatureSpecData {
  domain: string[];
  featureName: string[];
  description: string[];
  owner: string[];
  priority: string[];
}

interface FeatureSpecTableProps {
  projectId: string;
  isWebSocketConnected: boolean;
}

const FeatureSpecTable: React.FC<FeatureSpecTableProps> = ({ projectId, isWebSocketConnected }) => {
  const [data, setData] = useState<FeatureSpecData>({
    domain: [],
    featureName: [],
    description: [],
    owner: [],
    priority: [],
  });

  const [isEditing, setIsEditing] = useState<{ [index: number]: { [field: string]: boolean } }>({});
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
      domain: [...data.domain, ''],
      featureName: [...data.featureName, ''],
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
      domain: data.domain.filter((_, i) => i !== index),
      featureName: data.featureName.filter((_, i) => i !== index),
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

  return (
    <div className={styles.tableContainer}>
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
          {data.domain.map((_, index) => (
            <tr key={index}>
              {(['domain', 'featureName', 'description', 'owner', 'priority'] as const).map((column) => (
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
