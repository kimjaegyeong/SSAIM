import styles from './WeekRemind.module.css';



const WeekRemind = () => {
  return (
    <div className={styles.weekReview}>
      <div className={styles.MonSection}>
        <div className={styles.sectionTitle}>
            <p className={styles.h3}>21</p>
            <p className={styles.h3}>월</p>
        </div>
        <div className={styles.reviewContainer}>
            <p className={styles.p}>
            ⭕ Keep: 드디어 OpenCV를 활용한 모델을 프론트에 올렸습니다!!!!!! 실시간으로 mediapipe로 사람의 관절의 포인트를 출력하고 모델에 적용시켜 예측값이 프론트 화면에 나오도록 구현했습니다. 오늘 더 많은 데이터를 수집하기 위해 직접 도복을 입고 촬영을 했는데 꽤 정확도가 높게 나와 만족하고 있습니다.
⚠ Problem: 모델을 프론트에 올려서 출력한은 것까지 성공했지만 여전히 웹캠의 반응속도가 느립니다. 코드를 좀 더 뜯어보고 개선방안을 찾아보도록 하겠습니다!
✅ Try: 품새 심사 진행률 + 모델 연결시키기 겨루기에 적용시킬 모델 학습하기
            </p>
        </div>
      </div>
      <div className={styles.TusSection}>
        <div className={styles.sectionTitle}>
            <p className={styles.h3}>22</p>
            <p className={styles.h3}>화</p>
        </div>
        <div className={styles.reviewContainer}>
        </div>
      </div>
      <div className={styles.WedSection}>
        <div className={styles.sectionTitle}>
            <p className={styles.h3}>23</p>
            <p className={styles.h3}>수</p>
        </div>
        <div className={styles.reviewContainer}>
        </div>
      </div>
      <div className={styles.ThuSection}>
        <div className={styles.sectionTitle}>
            <p className={styles.h3}>24</p>
            <p className={styles.h3}>목</p>
        </div>
        <div className={styles.reviewContainer}>
        </div>
      </div>
      <div className={styles.FriSection}>
        <div className={styles.sectionTitle}>
            <p className={styles.h3}>25</p>
            <p className={styles.h3}>금</p>
        </div>
        <div className={styles.reviewContainer}>
        </div>
      </div>
    </div>
  );
};

export default WeekRemind;