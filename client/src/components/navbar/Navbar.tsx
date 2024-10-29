import styles from './Navbar.module.css';
import { IoHomeOutline } from 'react-icons/io5';
import { IoLayersOutline, IoPeopleOutline, IoDocumentTextOutline, IoLogOutOutline } from 'react-icons/io5';

const Navbar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.navList}>
        <div className={styles.navItem}>
          <div className={styles.profileImage}></div>
          <span className={styles.navText}>이름</span>
        </div>
        <div className={styles.navItem}>
          <IoHomeOutline className={styles.icon}></IoHomeOutline>
          <span className={styles.navText}>메인페이지</span>
        </div>
        <div className={styles.navItem}>
          <IoLayersOutline className={styles.icon}></IoLayersOutline>
          <span className={styles.navText}>프로젝트</span>
        </div>
        <div className={styles.navItem}>
          <IoPeopleOutline className={styles.icon}></IoPeopleOutline>
          <span className={styles.navText}>팀 구성 게시판</span>
        </div>
        <div className={styles.navItem}>
          <IoDocumentTextOutline className={styles.icon}></IoDocumentTextOutline>
          <span className={styles.navText}>회고</span>
        </div>
      </div>
      <div className={styles.footer}><IoLogOutOutline className={styles.icon}></IoLogOutOutline></div>
    </div>
  );
};

export default Navbar;
