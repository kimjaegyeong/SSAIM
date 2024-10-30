import Board from '../../features/teamBuilding/components/board/TeamBuildingBoard'
import styles from './MeetingListPage.module.css'

const MeetingListPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>팀원 모집 게시판</h1>
      <Board />
    </div>
  );
};

export default MeetingListPage;
