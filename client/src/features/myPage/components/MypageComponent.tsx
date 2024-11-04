import React, { useState } from 'react';
import styles from './MypageComponent.module.css';
import { FaPen } from 'react-icons/fa6';

const MypageComponent: React.FC = () => {
  const user = {
    name: '유기상',
    cohort: '11기',
    region: '부울경',
    profileImage: 'path/to/profileImage.jpg', // 프로필 이미지 경로
  };

  // 상태 메시지와 스택 관련 상태
  const [statusMessage, setStatusMessage] = useState('열심히 배우는 중입니다!');
  const [stacks, setStacks] = useState('React, TypeScript, Node.js');
  const [isEditing, setIsEditing] = useState(false);

  // 상태 메시지 및 스택 편집 시작 함수
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 상태 메시지 입력값 변화 핸들러
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(e.target.value);
  };

  // 스택 입력값 변화 핸들러
  const handleStacksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStacks(e.target.value);
  };

  // 편집 모드 해제 및 상태 저장 함수
  const handleSaveStatus = () => {
    setIsEditing(false);
  };

  return (
    <div className={styles.myPageContainer}>
      {/* 헤더 */}
      <header className={styles.header}>
        <h1>{user.name} 님의 프로필 페이지</h1>
        <FaPen className={styles.modifyIcon} onClick={handleEditClick} />
      </header>

      {/* 본문 구역 */}
      <div className={styles.bodyContainer}>
        {/* 왼쪽 위 - 프로필 사진 및 리본 */}
        <div className={styles.profileSection}>
          <img src={user.profileImage} alt="프로필 사진" className={styles.profileImage} />
          <div className={styles.ribbon}>{`${user.cohort} ${user.region}`}</div>
        </div>

        {/* 오른쪽 위 - 이름, 기수, 지역, 상태 메시지 */}
        <div className={styles.infoSection}>
          <h2>{user.name}</h2>
          <p>{`${user.cohort} ${user.region}`}</p>
          <hr />
          <div className={styles.infoFooter}>
            {isEditing ? (
              <input
                type="text"
                value={statusMessage}
                onChange={handleStatusChange}
                onBlur={handleSaveStatus} // 포커스를 벗어나면 저장
                className={styles.statusInput}
              />
            ) : (
              <p className={styles.statusMessage}>{statusMessage}</p>
            )}
          </div>
        </div>

        {/* 왼쪽 아래 - 스택 목록 */}
        <div className={styles.stacksSection}>
          <h3>Stacks</h3>
          {isEditing ? (
            <input
              type="text"
              value={stacks}
              onChange={handleStacksChange}
              onBlur={handleSaveStatus} // 포커스를 벗어나면 저장
              className={styles.statusInput}
            />
          ) : (
            <p>{stacks}</p>
          )}
        </div>

        {/* 오른쪽 아래 - Commit Info */}
        <div className={styles.commitInfoSection}>
          <h3>Commit Info</h3>
        </div>
      </div>
    </div>
  );
};

export default MypageComponent;
