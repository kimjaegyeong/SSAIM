import { useParams } from 'react-router-dom';
import styles from './TeamBuildingPage.module.css'

const TeamBuildingListPage = () => {
  const { postId } = useParams();
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>게시글 상세 {postId}</h1>
    </div>
  );
};

export default TeamBuildingListPage;