import React, { useState, useEffect } from 'react';
import styles from './MypageComponent.module.css';
import { FaPen } from 'react-icons/fa6';
import HexagonChart from './commitChart/HexagonChart';
import { useUserInfoData } from '../hooks/useUserInfoData';
import useUserStore from '@/stores/useUserStore';
import { editUserData } from '../apis/editUserData';
import { getRegionLabel } from '@/utils/labelUtils';
import Button from '@/components/button/Button';
import { useNavigate } from 'react-router-dom';
type MypageProps = {
  profileOwnerId: number;
};
const MypageComponent: React.FC<MypageProps> = ({ profileOwnerId }) => {
  const navigate = useNavigate();

  // 프로필 페이지 정보 및 userId
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(profileOwnerId);
  // 상태 메시지와 스택 관련 상태
  const [statusMessage, setStatusMessage] = useState('');
  const [stacks, setStacks] = useState('');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [isEditingStack, setIsEditingStack] = useState(false);

  const isProfileOwner = userId === profileOwnerId;
  const dummyData = [60, 80, 50, 70, 40, 90];
  useEffect(() => {
    if (userInfo) {
      setStatusMessage(userInfo.userProfileMessage || '');
      setStacks(userInfo.userSkills || '');
    }
  }, [userInfo]);

  // 상태 메시지 및 스택 편집 시작 함수
  const handleEditStackClick = () => {
    setIsEditingStack(true);
    if (isEditingMessage) {
      handleSaveProfilesMessage();
    }
  };
  const handleEditMessageClick = () => {
    setIsEditingMessage(true);
    if (isEditingStack) {
      handleSaveStacks();
    }
  };

  // 상태 메시지 입력값 변화 핸들러
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(e.target.value);
  };

  // 스택 입력값 변화 핸들러
  const handleStacksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStacks(e.target.value);
  };

  // 상태 메시지 변경 시 API 요청
  const handleSaveProfilesMessage = () => {
    if (statusMessage !== userInfo?.userProfileMessage) {
      // 변경이 있을 때만 API 요청
      console.log('Status message updated:', statusMessage);
      // 여기에 API 요청 추가
      editUserData(userId, { userProfileMessage: statusMessage });
    }
    setIsEditingMessage(false);
  };

  // 스택 변경 시 API 요청
  const handleSaveStacks = () => {
    if (stacks !== userInfo?.userSkills) {
      // 변경이 있을 때만 API 요청
      console.log('Stacks updated:', stacks);
      // 여기에 API 요청 추가
      editUserData(userId, { userSkills: stacks });
    }
    setIsEditingStack(false);
  };

  return (
    <div className={styles.myPageContainer}>
      {/* 헤더 */}
      <header className={styles.header}>
        <h1>{userInfo?.userName} 님의 프로필 페이지</h1>
        {isProfileOwner ? <Button size="xsmall" colorType="green" children="개인정보수정" onClick={() => {
          navigate('/profile/edit');
        }}></Button> : null}
      </header>

      {/* 본문 구역 */}
      <div className={styles.bodyContainer}>
        {/* 왼쪽 위 - 프로필 사진 및 리본 */}
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <img src={userInfo?.userProfileImage} alt="프로필 사진" className={styles.profileImage} />
            <div className={styles.ribbon}>{`${userInfo?.userGeneration}기 ${
              userInfo ? getRegionLabel(userInfo?.userCampus) : null
            }`}</div>
          </div>
        </div>

        {/* 오른쪽 위 - 이름, 기수, 지역, 상태 메시지 */}
        <div className={styles.infoSection}>
          <div className={styles.infoHeader}>
            <h2>{userInfo?.userName}</h2>
            <p>{`${userInfo?.userGeneration}기 ${userInfo ? getRegionLabel(userInfo?.userCampus) : null}`}</p>
          </div>
          <hr />
          <div className={styles.infoFooter}>
            {isProfileOwner ? <FaPen className={styles.modifyIcon} onClick={handleEditMessageClick} /> : null}

            {isEditingMessage ? (
              <input
                type="text"
                value={statusMessage}
                onChange={handleStatusChange}
                onBlur={handleSaveProfilesMessage} // 포커스를 벗어나면 저장
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
          <hr />
          <div className={styles.stacksBody}>
            {isProfileOwner ? <FaPen className={styles.modifyIcon} onClick={handleEditStackClick} /> : null}
            {isEditingStack ? (
              <input
                type="text"
                value={stacks}
                onChange={handleStacksChange}
                onBlur={handleSaveStacks} // 포커스를 벗어나면 저장
                className={styles.stackInput}
              />
            ) : (
              <p>{stacks}</p>
            )}
          </div>
        </div>

        {/* 오른쪽 아래 - Commit Info */}
        <div className={styles.commitInfoSection}>
          <h3>Commit Info</h3>
          <hr />
          <HexagonChart data={dummyData} />
        </div>
      </div>
    </div>
  );
};

export default MypageComponent;
