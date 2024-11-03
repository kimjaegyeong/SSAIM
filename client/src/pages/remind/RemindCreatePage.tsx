import styles from './RemindCreatePage.module.css'
import remindBG from '../../assets/remind/remindBG.png'


const RemindCreatePage = () => {
  return (
  <div>
    <img src={remindBG} alt="remindBG" className={styles.remindBG}/>
    <div className={styles.container}>
      <div className={styles.remindIntroText}>
        <div className={styles.remindIntroDesc}>
            우리가 함께 만드는 개발 이야기를 생성할<br /> 프로젝트를 선택해주세요
        </div>
      </div>
      <div className={styles.remindButton}>
      </div>
    </div>

  
  </div>

  );
};

export default RemindCreatePage;
