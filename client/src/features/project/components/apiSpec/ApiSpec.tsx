import React, { useState, useEffect } from 'react';
import styles from './ApiSpec.module.css';
import { MdDelete } from "react-icons/md";

interface ApiSpec {
  id: number;
  category: string;
  description: string;
  url: string;
  method: string;
  statusCode: string;
  owner: string;
  state: string;
}

const ApiSpecTable: React.FC = () => {
  const [data, setData] = useState<ApiSpec[]>([
    { id: 1, category: '회원 관리', description: '로그인', url: '/users/login', method: 'POST', statusCode: '200', owner: 'XXX', state: '개발 중' },
    { id: 2, category: '회원 관리', description: '회원가입', url: '/users', method: 'POST', statusCode: '200', owner: 'XXX', state: '개발 중' },
    { id: 3, category: '회원 관리', description: '비밀번호 찾기', url: '/users/password', method: 'POST', statusCode: '200', owner: 'XXX', state: '개발 중' },
  ]);
  const [isEditing, setIsEditing] = useState<{ [key: number]: { [field: string]: boolean } }>({});

  const handleInputChange = (index: number, field: keyof ApiSpec, value: string | number) => {
    const updatedData = [...data];
    (updatedData[index] as any)[field] = value;
    setData(updatedData);
  };

  const handleEditClick = (index: number, field: keyof ApiSpec) => {
    setIsEditing((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: true },
    }));
  };

  const handleBlur = (index: number, field: keyof ApiSpec) => {
    setIsEditing((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: false },
    }));
  };

  const addNewRow = () => {
    const newRow: ApiSpec = {
      id: data.length + 1,
      category: '',
      description: '',
      url: '',
      method: '',
      statusCode: '',
      owner: '',
      state: ''
    };
    setData([...data, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);

    const reorderedData = updatedData.map((item, idx) => ({
      ...item,
      id: idx + 1,
    }));

    setData(reorderedData);
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number, field: keyof ApiSpec) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur(index, field);
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
            <th>카테고리</th>
            <th>설명</th>
            <th>URL</th>
            <th>Method</th>
            <th>statusCode</th>
            <th>담당자</th>
            <th>개발 상태</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id}>
              {['category', 'description', 'url', 'method', 'statusCode', 'owner', 'state'].map((field) => (
                <td
                  key={field}
                  onClick={() => handleEditClick(index, field as keyof ApiSpec)}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {isEditing[index]?.[field] ? (
                    <textarea
                      value={row[field as keyof ApiSpec]}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          field as keyof ApiSpec,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => handleKeyPress(e, index, field as keyof ApiSpec)}
                      onBlur={() => handleBlur(index, field as keyof ApiSpec)}
                      autoFocus
                      ref={(el) => el && autoResize(el)}
                    />
                  ) : (
                    row[field as keyof ApiSpec]
                  )}
                </td>
              ))}
              <td>
                <MdDelete onClick={() => handleDeleteRow(index)}/>
              </td>
            </tr>
          ))}
          <tr className={styles.addRow} onClick={addNewRow}>
            <td colSpan={7} className={styles.addRowText}>
              + Add New Row
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ApiSpecTable;
