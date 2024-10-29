// layouts/MainLayout.tsx
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.mainLayout}>
    <Navbar />  {/* 좌측 고정 Navbar */}
    <div className={styles.content}>
      <Outlet />  {/* 라우트로 변경되는 콘텐츠 영역 */}
    </div>
  </div>
  )
};

export default MainLayout;
