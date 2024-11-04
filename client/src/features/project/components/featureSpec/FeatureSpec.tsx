import React, { useState, useEffect, useRef } from 'react';
import styles from './FeatureSpec.module.css';

interface FeatureSpec {
  id: number;
  category: string;
  featureName: string;
  details: string;
  type: string;
  owner: string;
  priority: number;
}

const FeatureSpecTable: React.FC = () => {
  const [data, setData] = useState<FeatureSpec[]>([
    { id: 1, category: 'User Management', featureName: 'Login', details: 'Login feature', type: 'BE', owner: 'Yoon Donghee', priority: 1 },
    { id: 2, category: 'User Management', featureName: 'Sign Up', details: 'Sign up feature', type: 'BE', owner: 'Yoon Donghee', priority: 1 },
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
      priority: 1,
    };
    setData([...data, newRow]);
  };

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
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
            <th>ID</th>
            <th>Category</th>
            <th>Feature Name</th>
            <th>Details</th>
            <th>Type</th>
            <th>Owner</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id}>
              <td>{row.id}</td>
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
                      onBlur={() => handleBlur(index, field as keyof FeatureSpec)}
                      autoFocus
                      ref={(el) => el && autoResize(el)}
                    />
                  ) : (
                    row[field as keyof FeatureSpec]
                  )}
                </td>
              ))}
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

export default FeatureSpecTable;
