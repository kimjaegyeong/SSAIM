// LoginForm.tsx
import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import Button from '../../../../components/button/Button';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
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
      </form>
      <Button size="small" colorType="blue">
        로그인
      </Button>
      <div className={styles.findpw}>
        비밀번호 찾기
      </div>      
    </div>
  );
};

export default LoginForm;
