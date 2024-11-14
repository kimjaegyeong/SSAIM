import React, { useState, useEffect, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

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
      };
      setProfile(userInfoEdit);
      if (userInfo.userProfileImage) {
        setProfileImagePreview(userInfo.userProfileImage);
      }
    }
  }, [userInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'userPhone') {
      const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError('전화번호 형식은 000-0000-0000입니다.');
      } else {
        setPhoneError(null);
      }
    }
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.exec(file.name)) {
        alert('허용된 이미지 형식(.jpg, .jpeg, .png, .gif)만 업로드 가능합니다.');
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phoneError) {
      alert('전화번호 형식이 올바르지 않습니다.');
      return;
    }
    try {
      await editUserData(userId, profile, profileImage);
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.editProfileContainer}>
      <h2 className={styles.title}>개인정보 수정</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.imageSection} onClick={handleFileClick}>
          {profileImagePreview ? (
            <img src={profileImagePreview} alt="프로필 사진" className={styles.imagePreview} />
          ) : (
            <div className={styles.imagePlaceholder}>사진 추가</div>
          )}
        </div>

        <input
          type="file"
          accept=".jpg, .jpeg, .png, .gif"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <label>
          이름:
          <p className={styles.staticInfo}>{profile.userName}</p>
        </label>

        <label>
          이메일:
          <p className={styles.staticInfo}>{profile.userEmail}</p>
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
            min={1}
            max={13}
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
            max={today}
          />
        </label>

        <label>
          성별:
          <select name="userGender" value={profile.userGender} onChange={handleChange} className={styles.input}>
            <option value={0}>여성</option>
            <option value={1}>남성</option>
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
            placeholder="000-0000-0000"
          />
          {phoneError && <p className={styles.error}>{phoneError}</p>}
        </label>

        <button type="submit" className={styles.submitButton}>
          저장
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
