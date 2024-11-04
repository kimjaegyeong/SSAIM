import { useNavigate } from 'react-router-dom';
import styles from './RemindIntroPage.module.css'
import remindBG from '../../assets/remind/remindBG.png'
import remindIntro from '../../assets/remind/remindIntro.png'
import remindCreate from '../../assets/remind/remindCreate.png'
import remindList from '../../assets/remind/remindList.png'


const RemindIntroPage = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate('/remind/create'); 
  };

  const handleListClick = () => {
    navigate('/remind/list'); 
  };

  return (
  <div>
    <img src={remindBG} alt="remindBG" className={styles.remindBG}/>
    <div className={styles.container}>
      <div className={styles.remindIntroText}>
        <img src={remindIntro} alt="remindIntro" className={styles.remindIntro} />
        <div className={styles.remindIntroDesc}>
            프로젝트를 마무리하며<br /> 나의 개발 이야기를 생성해보세요
        </div>
      </div>
      <div className={styles.remindButton}>
        <img 
          src={remindCreate} 
          alt="remindCreate" 
          className={styles.remindCreate} 
          onClick={handleCreateClick} 
          style={{ cursor: 'pointer' }} 
        />
        <img 
          src={remindList} 
          alt="remindList" 
          className={styles.remindList} 
          onClick={handleListClick} 
          style={{ cursor: 'pointer' }} 
        />
      </div>
    </div>

  
  </div>

  );
};

export default RemindIntroPage;
