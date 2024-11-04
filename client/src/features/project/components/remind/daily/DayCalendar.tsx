import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './DayCalendar.module.css';

interface DayCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DayCalendar: React.FC<DayCalendarProps> = ({ selectedDate, onDateChange }) => {
  return (
    <div className={styles.calendarWrapper}>
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
        className={styles.dayCalendar}
      />
    </div>
  );
};

export default DayCalendar;
