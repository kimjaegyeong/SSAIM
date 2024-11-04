import styles from './MypageComponent.module.css';

const MypageComponent: React.FC = () => {
  const user = {
    name: '유기상',
    cohort: '11기',
    region: '부울경',
    statusMessage: '열심히 배우는 중입니다!',
    profileImage: 'path/to/profileImage.jpg', // 프로필 이미지 경로
    stacks: ['React', 'TypeScript', 'Node.js'], // 예시 스택
  };

  return (
    <div className={styles.myPageContainer}>
      {/* 헤더 */}
      <header className={styles.header}>
        <h1>{user.name} 님의 프로필 페이지</h1>
      </header>

      {/* 본문 구역 */}
      <div className={styles.bodyContainer}>
        {/* 왼쪽 위 - 프로필 사진 및 리본 */}
        <div className={styles.profileSection}>
          <img src={user.profileImage} alt="프로필 사진" className={styles.profileImage} />
          <div className={styles.ribbon}>{`${user.cohort} ${user.region}`}</div>
        </div>

        {/* 오른쪽 위 - 이름, 기수, 지역, 상태 메시지 */}
        <div className={styles.infoSection}>
          <h2>{user.name}</h2>
          <p>{`${user.cohort} ${user.region}`}</p>
          <p className={styles.statusMessage}>{user.statusMessage}</p>
        </div>

        {/* 왼쪽 아래 - 스택 목록 */}
        <div className={styles.stacksSection}>
          <h3>Stacks</h3>
          <ul>
            {user.stacks.map((stack, index) => (
              <li key={index}>{stack}</li>
            ))}
          </ul>
        </div>

        {/* 오른쪽 아래 - Commit Info */}
        <div className={styles.commitInfoSection}>
          <h3>Commit Info</h3>
        </div>
      </div>
    </div>
  );
};

export default MypageComponent;
