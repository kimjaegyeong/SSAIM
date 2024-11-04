import useTeamStore from '../../../stores/useTeamStore';
import styles from './SearchResultItem.module.css';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  profileImage: string;
}

interface SearchResultItemProps {
  member: TeamMember;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ member }) => {
  const { addMember } = useTeamStore();

  const handleAddMember = () => {
    addMember(member);
  };

  return (
    <div className={styles.resultItem}>
      <img src={member.profileImage} alt={`${member.name}의 프로필`} className={styles.profileImage} />
      <div className={styles.memberInfo}>
        <div>{member.name}</div>
        <div className={styles.email}>{member.email}</div>
      </div>
      <button onClick={handleAddMember} className={styles.addButton}>+</button>
    </div>
  );
};

export default SearchResultItem;
