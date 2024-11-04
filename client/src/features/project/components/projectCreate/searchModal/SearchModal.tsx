import { useState } from 'react';
import SearchResultItem from './SearchResultItem';
import styles from './SearchModal.module.css';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  profileImage: string;
}

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<TeamMember[]>([]);
  const handleSearch = async () => {
    setResults([
      { id: 1, name: '홍길동', email: 'hong@example.com', profileImage: 'path/to/image1.jpg' },
      { id: 2, name: '김영희', email: 'kim@example.com', profileImage: 'path/to/image2.jpg' },
    ]);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>사용자 검색</h3>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        <hr />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          검색
        </button>
        <div className={styles.results}>
          {results.map((result) => (
            <SearchResultItem key={result.id} member={result} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
