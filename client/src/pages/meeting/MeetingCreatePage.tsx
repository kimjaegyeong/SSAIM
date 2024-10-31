import CreateTeam from '../../features/teamBuilding/components/createTeam/CreateTeam'
import styles from './MeetingPage.module.css'

const MeetingCreatePage = () => {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>팀 생성</h1>
        <CreateTeam />
      </div>
    );
  };
  
  export default MeetingCreatePage;
  