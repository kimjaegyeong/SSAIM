import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './WeekCalendar.module.css';

interface WeekCalendarProps {
  selectedDate?: Date; // 선택적 프로퍼티로 변경
  onDateChange: (dateInfo: { checkDate: string; startDate: string; endDate: string }) => void;
}

const getMonday = (date: Date): Date => {
  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day; // Adjust for Sunday (0) as start of the week
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
};

const getFriday = (date: Date): Date => {
  const monday = getMonday(date);
  return new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4); // Friday is 4 days after Monday
};

const WeekCalendar: React.FC<WeekCalendarProps> = ({ selectedDate, onDateChange }) => {
  // selectedDate가 없다면 오늘 날짜로 설정
  const [date, setDate] = useState<Date>(selectedDate || new Date());

  const weekStart = getMonday(date);

  useEffect(() => {
    // 컴포넌트 마운트 시 오늘 날짜를 기준으로 정보를 전달
    const monday = getMonday(new Date());
    const friday = getFriday(new Date());
    const dateInfo = {
      checkDate: moment(new Date()).format('YYYY-MM-DD'),
      startDate: moment(monday).format('YYYY-MM-DD'),
      endDate: moment(friday).format('YYYY-MM-DD'),
    };

    onDateChange(dateInfo); // 오늘 날짜의 정보를 전달
  }, [onDateChange]);

  const handleDateChange = (date: Date) => {
    const monday = getMonday(date);
    const friday = getFriday(date);
    const dateInfo = {
      checkDate: moment(date).format('YYYY-MM-DD'),
      startDate: moment(monday).format('YYYY-MM-DD'),
      endDate: moment(friday).format('YYYY-MM-DD'),
    };

    setDate(date);  // 새로운 날짜로 상태 업데이트
    onDateChange(dateInfo);
  };

  // 주말(토요일, 일요일) 비활성화
  const disableWeekends = ({ date }: { date: Date }) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 일요일(0) 또는 토요일(6)일 경우 비활성화
  };

  return (
    <div className={styles.calendarWrapper}>
      <Calendar
        onChange={(date) => handleDateChange(date as Date)}
        value={date}  // state에서 관리하는 날짜 사용
        formatDay={(_, date) => moment(date).format('D')}
        formatYear={(_, date) => moment(date).format('YYYY')}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        className={styles.customCalendar}
        tileDisabled={disableWeekends} // 주말 비활성화 함수 추가
        tileClassName={({ date }) => {
          const dayOfWeek = date.getDay();
          const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // 월~금
          const isCurrentWeek = moment(date).isSame(weekStart, 'week'); // 현재 주의 모든 평일 확인
          
          // 특정 날짜에 따라 스타일을 직접 적용합니다
          if (isWeekday && isCurrentWeek) {
            return `${styles.weekdayTile} ${date.getTime() === date.getTime() ? styles.activeTile : ''}`;
          }
          return '';
        }}
        // 현재 날짜에 스타일을 추가
        tileContent={({ date }) => {
          const isToday = moment().isSame(date, 'day');
          return isToday ? <span className={styles.todayMarker} /> : null;
        }}
      />
    </div>
  );
};

export default WeekCalendar;
