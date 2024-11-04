// SignUp.tsx
import React, { useState } from 'react';
import styles from './SignUpForm.module.css';
import { FaAngleLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

interface SignUpFormData {
  userEmail: string;
  userName: string;
  userPw: string;
  userClass: number;
  userCampus: number;
  userGeneration: number;
  userNickname: string;
  userBirth: string;
  userGender: number;
  userPhone: string;
}

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    userEmail: '',
    userName: '',
    userPw: '',
    userClass: 1,
    userCampus: 1,
    userGeneration: 11,
    userNickname: '',
    userBirth: '',
    userGender: 0,
    userPhone: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign Up Data:', formData);
    // 회원가입 요청 API 호출 부분 추가 가능
  };
  const handleBackButton = () => {
    navigate('/login');
  };
  return (
    <div className={styles.signUpContainer}>
      <div className={styles.backButton} onClick={handleBackButton}>
        <FaAngleLeft />
      </div>
      <h1 className={styles.title}>회원가입</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>이메일</label>
          <input type="email" name="userEmail" value={formData.userEmail} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label>이름</label>
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label>비밀번호</label>
          <input type="password" name="userPw" value={formData.userPw} onChange={handleChange} required />
        </div>
        <div className={styles.inputGroup}>
          <label>클래스</label>
          <input type="number" name="userClass" value={formData.userClass} onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label>캠퍼스</label>
          <input type="number" name="userCampus" value={formData.userCampus} onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label>기수</label>
          <input type="number" name="userGeneration" value={formData.userGeneration} onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label>닉네임</label>
          <input type="text" name="userNickname" value={formData.userNickname} onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label>생년월일</label>
          <input type="date" name="userBirth" value={formData.userBirth} onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label>성별</label>
          <input type="number" name="userGender" value={formData.userGender} onChange={handleChange} />
        </div>
        <div className={styles.inputGroup}>
          <label>전화번호</label>
          <input type="text" name="userPhone" value={formData.userPhone} onChange={handleChange} />
        </div>
        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
