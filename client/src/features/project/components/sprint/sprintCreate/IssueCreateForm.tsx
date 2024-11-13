import React, { useState, useRef, useEffect } from 'react';
import styles from './IssueCreateForm.module.css';
import { useParams } from 'react-router-dom';
import { useEpicListData } from '@/features/project/hooks/sprint/useEpicListData';
import { useCreateIssueMutation } from '@/features/project/hooks/sprint/useCreateIssueMutation';
import { IssueCreateDTO } from '@/features/project/types/sprint/IssueCreateDTO';
const IssueCreateForm: React.FC = () => {
  const { projectId } = useParams();
  // sprintId 도 받아와야함!
  // issue 생성 후에 sprintId 에 넣어줘야함
  // const { data: sprint } = useSprintQuery(Number(projectId), Number(sprintId));
  const { data: epicList } = useEpicListData(Number(projectId));
  const {mutate : createIssue} = useCreateIssueMutation(Number(projectId));
  const [issueType, setIssueType] = useState<'Story'|'Task'>('Task');
  const [selectedEpic, setSelectedEpic] = useState<string|null>('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [storyPoint, setStoryPoint] = useState(0);

  const [isIssueTypeOpen, setIsIssueTypeOpen] = useState(false);
  const [isEpicOpen, setIsEpicOpen] = useState(false);

  const issueTypeRef = useRef<HTMLDivElement>(null);
  const epicRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (issueTypeRef.current && !issueTypeRef.current.contains(event.target as Node)) {
        setIsIssueTypeOpen(false);
      }
      if (epicRef.current && !epicRef.current.contains(event.target as Node)) {
        setIsEpicOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSaveIssue = () => {
    const data: IssueCreateDTO = {
      issueType,
      summary,
      description,
      storyPoint,
      assignee: null,
      ...(selectedEpic && { epicKey: selectedEpic }) // selectedEpic이 있을 때만 epicKey 추가
    };
    
    createIssue(data, {
      onSuccess: () => {
        console.log('New Issue created:', data);
        // 여기에 toast 알림 추가
      },
      onError: (error) => {
        console.error('이슈 생성 오류:', error);
        // 여기에 오류 toast 알림 추가
      },
    });
  };
  return (
    <>
      <h3>이슈 추가</h3>
      <div className={styles.issueForm}>
        {/* 이슈 타입 */}
        <div ref={issueTypeRef}>
          <label className={styles.label}>이슈 타입</label>
          <div className={styles.customDropdown}>
            <button onClick={() => setIsIssueTypeOpen(!isIssueTypeOpen)} className={styles.dropdownButton}>
              {issueType}
            </button>
            {isIssueTypeOpen && (
              <ul className={styles.dropdownMenu}>
                {(['Task', 'Story'] as const).map((type) => (
                  <li
                    key={type}
                    onClick={() => {
                      setIssueType(type);
                      setIsIssueTypeOpen(false);
                    }}
                    className={styles.dropdownItem}
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Epic 선택 */}
        <div ref={epicRef}>
          <label className={styles.label}>Epic</label>
          <div className={styles.customDropdown}>
            <button onClick={() => setIsEpicOpen(!isEpicOpen)} className={styles.dropdownButton}>
              {selectedEpic ? epicList?.find((epic) => epic.key === selectedEpic)?.summary : '에픽 미설정'}
            </button>
            {isEpicOpen && (
              <ul className={styles.dropdownMenu}>
                <li
                  onClick={() => {
                    setSelectedEpic(null);
                    setIsEpicOpen(false);
                  }}
                  className={styles.dropdownItem}
                >
                  에픽 미설정
                </li>
                {epicList?.map((epic) => (
                  <li
                    key={epic.key}
                    onClick={() => {
                      setSelectedEpic(epic.key);
                      setIsEpicOpen(false);
                    }}
                    className={styles.dropdownItem}
                  >
                    {epic.summary}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 나머지 필드들 */}
        <div>
          <label className={styles.label}>제목</label>
          <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} className={styles.input} />
        </div>
        <div>
          <label className={styles.label}>설명</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label}>스토리 포인트</label>
          <input
            type="number"
            value={storyPoint}
            onChange={(e) => setStoryPoint(Math.max(0, Number(e.target.value)))}
            className={styles.inputNumber}
            min="0"
          />
        </div>

        <button onClick={handleSaveIssue} className={styles.button}>
          저장
        </button>
      </div>
    </>
  );
};

export default IssueCreateForm;
