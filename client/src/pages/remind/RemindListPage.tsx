import { useNavigate } from 'react-router-dom';
import styles from './RemindListPage.module.css';
import bookList from '../../assets/remind/bookList.png';
import book from '../../assets/remind/book.png';

const RemindListPage = () => {
  const navigate = useNavigate();

  
  const handleBookClick = (remindId: number) => {
    navigate(`/remind/${remindId}`);
  };

  return (
    <div>
      <img src={bookList} alt="bookList" className={styles.bookList} />
      <div className={styles.container}>
        <div className={styles.Row}> 
          {Array.from({ length: 5 }).map((_, index) => (
            <img 
              key={index} 
              src={book} 
              alt="book" 
              className={styles.book} 
              onClick={() => handleBookClick(index + 1)} // remindId를 index + 1로 설정
            />
          ))}
        </div>
        <div className={styles.Row}> 
          <img 
            src={book} 
            alt="book" 
            className={styles.book} 
            onClick={() => handleBookClick(6)} // remindId를 6으로 설정
          />
        </div>
        <div className={styles.Row}> 
          <img 
            src={book} 
            alt="book" 
            className={styles.book} 
            onClick={() => handleBookClick(7)} // remindId를 7으로 설정
          />
        </div>
      </div>
    </div>
  );
};

export default RemindListPage;
