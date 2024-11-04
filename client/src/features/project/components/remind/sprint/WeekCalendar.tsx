import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './WeekCalendar.module.css';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const getMonday = (date: Date): Date => {
  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day; // Adjust for Sunday (0) as start of the week
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
};

const WeekCalendar: React.FC<WeekCalendarProps> = ({ selectedDate, onDateChange }) => {
  const weekStart = getMonday(selectedDate);

  const handleDateChange = (date: Date) => {
    const monday = getMonday(date);
    onDateChange(monday);
  };

  return (
    <div className={styles.calendarWrapper}>
      <Calendar
        onChange={(date) => handleDateChange(date as Date)}
        value={selectedDate}
        formatDay={(_, date) => moment(date).format('D')}
        formatYear={(_, date) => moment(date).format('YYYY')}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        className={styles.customCalendar}
        tileClassName={({ date }) => {
          const dayOfWeek = date.getDay();
          const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // 월~금
          const isCurrentWeek = moment(date).isSame(weekStart, 'week'); // 현재 주의 모든 평일 확인
          
          // 특정 날짜에 따라 스타일을 직접 적용합니다
          if (isWeekday && isCurrentWeek) {
            return `${styles.weekdayTile} ${date.getTime() === selectedDate.getTime() ? styles.activeTile : ''}`;
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
