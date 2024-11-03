import useTeamStore from '../../../stores/useTeamStore';
import styles from './TeamMemberGrid.module.css';

const TeamMemberGrid = () => {
  const { members } = useTeamStore();

  const handleAddClick = () => {
    // 검색 모달을 여는 함수
  };

  return (
    <div className={styles.gridContainer}>
      {members.map((member) => (
        <div key={member.id} className={styles.memberBox}>
          <img src={member.profileImage} alt={`${member.name}의 프로필`} className={styles.profileImage} />
          <div className={styles.memberInfo}>
            <div>{member.name}</div>
            <div className={styles.email}>{member.email}</div>
          </div>
        </div>
      ))}
      {members.length < 10 && (
        <div className={styles.addBox} onClick={handleAddClick}>
          +
        </div>
      )}
    </div>
  );
};

export default TeamMemberGrid;
