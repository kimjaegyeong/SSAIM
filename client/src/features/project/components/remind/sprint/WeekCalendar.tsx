import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './WeekCalendar.module.css';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ selectedDate, onDateChange }) => {
  return (
    <div className={styles.calendar}>
      <Calendar
        onChange={(date) => onDateChange(date as Date)}
        value={selectedDate}
        formatDay={(_, date) => moment(date).format('D')}
        formatYear={(_, date) => moment(date).format('YYYY')}
        calendarType="gregory"
        showNeighboringMonth={false}
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        className={styles.weekCalendar}
      />
    </div>
  );
};

export default WeekCalendar;
