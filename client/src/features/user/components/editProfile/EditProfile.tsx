import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EditProfile.module.css';

interface UserProfile {
  userName: string;
  userPw: string;
  userEmail: string;
  userClass: number;
  userCampus: number;
  userGeneration: number;
  userNickname: string;
  userBirth: string;
  userGender: number;
  userPhone: string;
}

const EditProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    userName: '',
    userPw: '',
    userEmail: '',
    userClass: 0,
    userCampus: 0,
    userGeneration: 0,
    userNickname: '',
    userBirth: '',
    userGender: 0,
    userPhone: '',
  });

  useEffect(() => {
    // 초기 데이터 로드 (예: API로부터 사용자 정보 가져오기)
    axios.get('/api/users/me').then((response) => {
      setProfile(response.data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = () => {};

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
          비밀번호:
          <input
            type="password"
            name="userPw"
            value={profile.userPw}
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
          클래스:
          <input
            type="number"
            name="userClass"
            value={profile.userClass}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label>
          캠퍼스:
          <input
            type="number"
            name="userCampus"
            value={profile.userCampus}
            onChange={handleChange}
            className={styles.input}
          />
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
