import styles from './LoginPage.module.css';
import LoginForm from '../../../features/user/components/login/LoginForm';

const LoginPage = () => {
  return (
    <div className={styles.mainLayout}>
      <div className={styles.loginContainer}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
