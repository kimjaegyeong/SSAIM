import React, { useState, useEffect } from 'react';
import styles from './FeatureSpec.module.css';
import { MdDelete } from "react-icons/md";

interface FeatureSpec {
  id: number;
  category: string;
  featureName: string;
  details: string;
  type: string;
  owner: string;
  priority: string;
}

const FeatureSpecTable: React.FC = () => {
  const [data, setData] = useState<FeatureSpec[]>([
    { id: 1, category: '회원 관리', featureName: '로그인', details: '로그인 기능', type: 'BE', owner: 'XXX', priority: '1' },
    { id: 2, category: '회원 관리', featureName: '회원가입', details: '회원가입 기능', type: 'BE', owner: 'XXX', priority: '1' },
    { id: 3, category: '회원 관리', featureName: '비밀번호 찾기', details: '비밀번호 찾기', type: 'BE', owner: 'XXX', priority: '2' },
  ]);
  const [isEditing, setIsEditing] = useState<{ [key: number]: { [field: string]: boolean } }>({});

  const handleInputChange = (index: number, field: keyof FeatureSpec, value: string | number) => {
    const updatedData = [...data];
    (updatedData[index] as any)[field] = value;
    setData(updatedData);
  };

  const handleEditClick = (index: number, field: keyof FeatureSpec) => {
    setIsEditing((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: true },
    }));
  };

  const handleBlur = (index: number, field: keyof FeatureSpec) => {
    setIsEditing((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: false },
    }));
  };

  const addNewRow = () => {
    const newRow: FeatureSpec = {
      id: data.length + 1,
      category: '',
      featureName: '',
      details: '',
      type: '',
      owner: '',
      priority: '',
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number, field: keyof FeatureSpec) => {
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
            <th>기능명</th>
            <th>내용</th>
            <th>구분</th>
            <th>담당자</th>
            <th>우선순위</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id}>
              {['category', 'featureName', 'details', 'type', 'owner', 'priority'].map((field) => (
                <td
                  key={field}
                  onClick={() => handleEditClick(index, field as keyof FeatureSpec)}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {isEditing[index]?.[field] ? (
                    <textarea
                      value={row[field as keyof FeatureSpec]}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          field as keyof FeatureSpec,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => handleKeyPress(e, index, field as keyof FeatureSpec)}
                      onBlur={() => handleBlur(index, field as keyof FeatureSpec)}
                      autoFocus
                      ref={(el) => el && autoResize(el)}
                    />
                  ) : (
                    row[field as keyof FeatureSpec]
                  )}
                </td>
              ))}
              <td>
                <MdDelete onClick={() => handleDeleteRow(index)}/>
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
