import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import styles from './DayMyCreate.module.css';
import { FaRegClock } from "react-icons/fa6";
import { ImPencil } from "react-icons/im";
import Button from '../../../../../../components/button/Button';
import CreateCalendar from './CreateCalendar';
import { createDailyRemind }from '@features/project/apis/remind/createDailyRemind';
import { DailyRemindPostDTO } from '@features/project/types/remind/DailyRemindDTO';
import usePmIdStore from '@/features/project/stores/remind/usePmIdStore';

const DayMyCreate = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { pmId } = usePmIdStore();
  const [keepText, setKeepText] = useState("");
  const [problemText, setProblemText] = useState("");
  const [tryText, setTryText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const formattedDate = new Intl.DateTimeFormat('ko', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(selectedDate).replace(/ (\S+)$/, ' ($1)');

  const formattedCurrentDate = new Intl.DateTimeFormat('ko', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(currentDate).replace(/ (\S+)$/, ' ($1)');

  const handleButtonClick = async () => {
    if (!projectId) {
      console.error("Project ID is missing");
      return;
    }
    if (pmId === null) {
      console.error("Project Member ID is missing");
      return;
    }

    const dailyRemindContents = `🟢 Keep: ${keepText}\n🟠 Problem: ${problemText}\n🔵 Try: ${tryText}`;
    const dailyRemindDate = currentDate.toLocaleDateString("ko-KR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '-').replace('.', ''); // "YYYY-MM-DD" 형식으로 변환

    const dailyRemindData: DailyRemindPostDTO = {
      dailyRemindContents,
      projectMemberId: pmId, // 실제 projectMemberId를 여기에 설정해야 함
      dailyRemindDate,
    };

    console.log(dailyRemindData)

    try {
      await createDailyRemind(Number(projectId), dailyRemindData);
      console.log(dailyRemindData)
      navigate(`/project/${projectId}/remind`); // API 성공 시 리다이렉트
    } catch (error) {
      console.error("Failed to create daily remind:", error);
    }
  };

  const handlePencilClick = () => {
    setIsCalendarOpen((prev) => !prev);  // 달력 표시 상태 토글
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    setIsCalendarOpen(false);  // 날짜 선택 후 달력 숨기기
  };


  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.filterHeader}>
          <div className={styles.dateTitle}>
            <FaRegClock style={{ strokeWidth: 4, color: "#007bff" }} />
            {formattedCurrentDate}
            <ImPencil style={{ color: "black", cursor: 'pointer' }} onClick={handlePencilClick} />
            {isCalendarOpen && (
              <div className={styles.calendarContainer}>
                <CreateCalendar selectedDate={currentDate} onDateChange={handleDateChange} />
              </div>
            )}
          </div>
          <Button size="xsmall" colorType="blue" onClick={handleButtonClick}>완료</Button>
        </div>
        <div className={styles.myReview}>
          <div className={styles.keepSection}>
            <div className={styles.sectionTitle}>
              <h3 className={styles.h3}>Keep</h3>
            </div>
            <div className={styles.reviewContainer}>
              <textarea 
                className={styles.textarea} 
                placeholder={`- 현재 만족하고 있는 부분\n- 계속 이어갔으면 하는 부분`} 
                value={keepText} 
                onChange={(e) => setKeepText(e.target.value)} 
              />
            </div>
          </div>
          <div className={styles.problemSection}>
            <div className={styles.sectionTitle}>
              <h3 className={styles.h3}>Problem</h3>
            </div>
            <div className={styles.reviewContainer}>
              <textarea 
                className={styles.textarea} 
                placeholder={`- 불편하게 느끼는 부분\n- 개선이 필요하다고 생각되는 부분`} 
                value={problemText} 
                onChange={(e) => setProblemText(e.target.value)} 
              />
            </div>
          </div>
          <div className={styles.trySection}>
            <div className={styles.sectionTitle}>
              <h3 className={styles.h3}>Try</h3>
            </div>
            <div className={styles.reviewContainer}>
              <textarea 
                className={styles.textarea} 
                placeholder={`- Problem에 대한 해결책\n- 다음 회고 때 판별 가능한 것\n- 당장 실행가능한 것`} 
                value={tryText} 
                onChange={(e) => setTryText(e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <p className={styles.description}>조회할 날짜를 선택해주세요</p>
        <CreateCalendar selectedDate={selectedDate} onDateChange={setSelectedDate}/>
        <div className={styles.remindBox}>
            <div className={styles.dateSubTitle}>
                <FaRegClock style={{ strokeWidth: 2, color: "#007bff" }} />
                {formattedDate}
            </div>
            <div className={styles.remindText}>
                ⭕ Keep: 드디어 OpenCV를 활용한 모델을 프론트에 올렸습니다!!!!!! 실시간으로 mediapipe로 사람의 관절의 포인트를 출력하고 모델에 적용시켜 예측값이 프론트 화면에 나오도록 구현했습니다. 오늘 더 많은 데이터를 수집하기 위해 직접 도복을 입고 촬영을 했는데 꽤 정확도가 높게 나와 만족하고 있습니다.
⚠ Problem: 모델을 프론트에 올려서 출력한은 것까지 성공했지만 여전히 웹캠의 반응속도가 느립니다. 코드를 좀 더 뜯어보고 개선방안을 찾아보도록 하겠습니다!
✅ Try: 품새 심사 진행률 + 모델 연결시키기 겨루기에 적용시킬 모델 학습하기
            </div>
        </div>

      </div>
    </div>
  );
};

export default DayMyCreate;
