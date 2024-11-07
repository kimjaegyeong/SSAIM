import { useState, useEffect  } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SprintContainer.module.css';
import FilterHeader from './FilterHeader';
import Button from '../../../../../components/button/Button';
import WeekCalendar from './WeekCalendar'
import MySprint from './my/MySprint';
import TeamSprint from './team/TeamSprint';
import SprintModal from './SprintModal';
import moment from 'moment';
import usePmIdStore from '@/features/project/stores/remind/usePmIdStore';
import {useSprintRemind} from '@/features/project/hooks/remind/useSprintRemind';


const SprintContainer = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { pmId } = usePmIdStore();
    const [myTeam, setMyTeam] = useState('나의 회고');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedDateInfo, setSelectedDateInfo] = useState<{ checkDate: string; startDate: string; endDate: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formattedDate, setFormattedDate] = useState('');

    const { data: sprintRemindData, isError, error } = useSprintRemind({
      projectId: Number(projectId),
      projectMemberId: undefined,   
      checkDate: undefined,      
      startDate: undefined,      
      endDate: undefined,       
    });

    useEffect(() => {
      if (sprintRemindData) {
        console.log("Sprint Remind Data:", sprintRemindData);
      }
    }, [sprintRemindData, isError, error]);

    

    const handleDateChange = (dateInfo: { checkDate: string; startDate: string; endDate: string }) => {
      // 날짜 정보가 변경되었을 때만 상태 업데이트
      if (!selectedDateInfo || dateInfo.checkDate !== selectedDateInfo.checkDate) {
        setSelectedDate(new Date(dateInfo.checkDate));
        setSelectedDateInfo(dateInfo);
      }
    };

    const MyfilteredContents = sprintRemindData?.filter((item) =>
      item.projectMemberId === pmId &&
      selectedDateInfo &&
      item.startDate >= selectedDateInfo.startDate &&
      item.endDate <= selectedDateInfo.endDate
    ) || [];

    const TeamfilteredContents = sprintRemindData?.filter((item) =>
      selectedDateInfo &&
      item.startDate >= selectedDateInfo.startDate &&
      item.endDate <= selectedDateInfo.endDate
    ) || [];

    
    useEffect(() => {
      const month = moment(selectedDate).format('M'); // 현재 선택된 월
      const year = moment(selectedDate).format('YYYY'); // 현재 선택된 연도
      const startOfMonth = moment(selectedDate).startOf('month'); // 선택한 날짜의 월 시작일
      const weekNumber = Math.ceil((selectedDate.getDate() + startOfMonth.day()) / 7); // 주차 계산
      setFormattedDate(`${year}년 ${month}월 ${weekNumber}주차`); // 원하는 형식으로 포맷팅
      console.log(formattedDate)
  }, [selectedDate]);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <FilterHeader
            myTeam={myTeam}
            setMyTeam={setMyTeam}
            formattedDate={formattedDate}
        />
        <div className={styles.remindContent}>
          {myTeam === '나의 회고' && <MySprint contents={MyfilteredContents}/>}
          {myTeam === '팀원 회고' && <TeamSprint contents={TeamfilteredContents}/>}
        </div>
        
      </div>
      <div className={styles.right}>
        <Button size="large" colorType="purple" onClick={handleOpenModal}>
          🚀 주간 회고 생성
        </Button>
        <p className={styles.description}>조회할 날짜를 선택해주세요</p>
        <WeekCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
      </div>

      <SprintModal isOpen={isModalOpen} onClose={handleCloseModal} projectId={Number(projectId)}>

      </SprintModal>
    </div>
  );
};

export default SprintContainer;