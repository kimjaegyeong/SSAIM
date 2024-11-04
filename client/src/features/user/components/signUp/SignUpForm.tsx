// SignUp.tsx
import React, { useState } from 'react';
import styles from './SignUpForm.module.css';
import { FaAngleLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { SignUpFormData } from '@features/user/types/userTypes';
import { signUp } from '@features/user/apis/signUpApi';

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
  const [error, setError] = useState<string | null>(null); // 오류 상태 추가

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signUp(formData);
      navigate('/login');
    } catch (error) {
      setError('회원가입에 실패했습니다.');
      console.log(error);
    }
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
      {error && <div className={styles.errorMessage}>{error}</div>} {/* 오류 메시지 표시 */}
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
