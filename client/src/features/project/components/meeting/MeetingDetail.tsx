import { useLocation } from 'react-router-dom';
import styles from './MeetingDetail.module.css';
import Button from '../../../../components/button/Button';

interface MeetingDetailProps {
    newTitle: string;
    minutes: number;
  }

const MeetingDetail: React.FC<MeetingDetailProps> = ({ newTitle, minutes  }) => {
  const location = useLocation();
  const { title, date, duration } = location.state || {};

  const todayDate = new Date().toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  const summaryText = `1. 프로젝트 관리\n- 관리자/사용자 그룹 생성 및 그룹장 설정 기능 추가.\n
- 팀장 권한으로 JIRA, Gitlab 연동 가능.\n
- 스프린트 자동 생성 및 이슈 완료 알림 기능 포함.\n
- API 및 기능 명세서 템플릿 제공 결정.\n
2. 회고\n- 일일 회고 자동 작성 (회의록 기반), 주간 회고 자동 생성.\n
- 주간 회고를 바탕으로 '우리가 함께 만드는 개발 이야기' 생성 기능 추가.`;

  const meetingData = {
    title: title || newTitle, // 기본 제목
    date: date || todayDate, // 기본 날짜
    duration: duration || `${minutes}분`, // 기본 지속 시간
    participants: [
      {
        id: 1,
        name: "여대기",
        userImage:"profile.jpg",
        comment: "프로젝트 관리 관련해서는 관리자 생성부터 시작해서 그룹 장 설정, 그룹 이름 설정 등 주요 기능들이 들어가야 해요. 특히 JIRA나 Gitlab 연동은 팀장이 관리할 수 있도록 해야 하고요. 스프린트 생성기 같은 것도 추가하면 좋을 것 같아요. 자동으로 기간이나 주간 계획에 따라 생성되도록 하죠."
      },
      {
        id: 2,
        name: "조성인",
        userImage:"profile.jpg",
        comment: "그럼 외부 API 연동은 팀장 권한으로 제한하고, 스프린트는 기간 설정, 스토리포인트, 주간 계획 정도 입력하면 자동으로 생성되게 하죠."
      },
      {
        id: 3,
        name: "조원빈",
        userImage:"profile.jpg",
        comment: "이슈 알림 기능도 깃랩 MR 메시지를 기반으로 해서 이슈 상태 전환에 맞춰 알림이 가도록 만들면 좋겠네요. 또 ERD 이미지 업로드는 이미지 파일로만 가능하게 하죠."
      },
      {
        id: 4,
        name: "박지용",
        userImage:"profile.jpg",
        comment: "API 명세서나 기능 명세서는 작성할 수 있는 템플릿을 제공하고, 이를 기반으로 가이드라인 제공하는 식으로 하겠습니다."
      },
      {
        id: 5,
        name: "강수연",
        userImage:"profile.jpg",
        comment: "회고 기능에서는 일일 회고, 주간 회고 자동 생성이 핵심일 것 같아요. 특히 일일 회고는 된 회의록이 있는 경우 자동 작성이 가능하도록 하고, 주간 회고는 일일 회고나 JIRA 데이터를 활용해서 만들어 봅시다."
      }
    ]
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h3 className={styles.title}>{meetingData.title}</h3>
          <div className={styles.meetingInfo}>
            <span className={styles.date}>{meetingData.date}</span>
            <span className={styles.duration}>{meetingData.duration}</span>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.participants}>
            {meetingData.participants.map((participant) => (
              <div key={participant.id} className={styles.participantBox}>
                <img src={participant.userImage} alt="profile" />
                <div className={styles.participantComment}>
                  <p className={styles.participantName}>{participant.name}</p>
                  <p className={styles.comment}>{participant.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <div className={styles.right}>
        <Button size="large" colorType="green">
          🤖 AI 요약 확인하기
        </Button>
        <div className={styles.summaryBox}>
          <h3>요약 내용</h3>
          <div className={styles.summaryText}>
            {summaryText.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetail;
