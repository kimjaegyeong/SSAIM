import { useState } from 'react';
import { useNavigate, useParams, useLocation  } from 'react-router-dom'; 
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

  const location = useLocation();
  const { myfilteredMessages } = location.state || {};
  console.log(myfilteredMessages);

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

  interface DailyRemindMessage {
    dailyRemindDate: string;
    message: string;
  }

  // dailyRemindDate와 selectedDate가 일치하는 메시지 찾기
  const matchingMessage = myfilteredMessages?.find(
    (message: DailyRemindMessage) => {
      const messageDate = new Date(message.dailyRemindDate);
      // messageDate와 selectedDate를 비교
      return messageDate.toLocaleDateString("ko-KR") === selectedDate.toLocaleDateString("ko-KR");
    }
  );

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
                {matchingMessage ? (
                  <>
                    {matchingMessage.message}
                  </>
                ) : (
                  '선택한 날짜에 대한 회고가 없습니다.'
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default DayMyCreate;
