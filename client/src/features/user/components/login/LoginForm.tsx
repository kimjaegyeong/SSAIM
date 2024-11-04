// LoginForm.tsx
import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { login } from '@features/user/apis/loginApi';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <h1>Login</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            placeholder="Email"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            placeholder="Password"
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          로그인
        </button>
      </form>
      <div className={styles.findpw}>비밀번호 찾기</div>
    </div>
  );
};

export default LoginForm;
