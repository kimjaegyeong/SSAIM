import React, { useState, useEffect } from 'react';
import styles from './EditProfile.module.css';
import { UserInfoEditDTO } from '@features/user/types/UserInfoDTO';
import useUserStore from '@/stores/useUserStore';
import { editUserData } from '@/features/myPage/apis/editUserData';
import { useUserInfoData } from '@/features/myPage/hooks/useUserInfoData';
import { regionMap, getRegionLabel } from '@/utils/labelUtils';
import { useNavigate } from 'react-router-dom';
const EditProfile: React.FC = () => {
  const { userId } = useUserStore();
  const { data: userInfo } = useUserInfoData(userId);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserInfoEditDTO>({
    userName: '',
    userEmail: '',
    userCampus: 0,
    userGeneration: 0,
    userNickname: '',
    userBirth: '',
    userGender: 0,
    userPhone: '',
  });

  useEffect(() => {
    if (userInfo) {
      const userInfoEdit: UserInfoEditDTO = {
        userEmail: userInfo.userEmail,
        userName: userInfo.userName,
        userNickname: userInfo.userNickname,
        userPhone: userInfo.userPhone,
        userGender: userInfo.userGender,
        userGeneration: userInfo.userGeneration,
        userCampus: userInfo.userCampus,
        userBirth: userInfo.userBirth,
        userProfileMessage: userInfo.userProfileMessage ?? undefined,
        userSkills: userInfo.userSkills ?? undefined,
        userRole: userInfo.userRole,
        // userProfileImage: userInfo.userProfileImage,
      };
      setProfile(userInfoEdit);
    }
  }, [userInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editUserData(userId, profile)
      .then(() => navigate(`/profile/${userId}`))
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.editProfileContainer}>
      <h2 className={styles.title}>개인정보 수정</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          이름:
          <input
            type="text"
            name="userName"
            value={profile.userName}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label>
          이메일:
          <input
            type="email"
            name="userEmail"
            value={profile.userEmail}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label>
          캠퍼스:
          <select name="userCampus" value={profile.userCampus} onChange={handleChange} className={styles.input}>
            {Object.keys(regionMap).map((key) => (
              <option key={key} value={key}>
                {getRegionLabel(Number(key))}
              </option>
            ))}
          </select>
        </label>
        <label>
          기수:
          <input
            type="number"
            name="userGeneration"
            value={profile.userGeneration}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label>
          닉네임:
          <input
            type="text"
            name="userNickname"
            value={profile.userNickname}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label>
          생일:
          <input
            type="date"
            name="userBirth"
            value={profile.userBirth}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label>
          성별:
          <select name="userGender" value={profile.userGender} onChange={handleChange} className={styles.input}>
            <option value={0}>남성</option>
            <option value={1}>여성</option>
          </select>
        </label>
        <label>
          전화번호:
          <input
            type="tel"
            name="userPhone"
            value={profile.userPhone}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.submitButton}>
          저장
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
