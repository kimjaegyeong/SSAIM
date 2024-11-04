import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './MeetingCalendar.module.css';



const MeetingCalendar = () => {
  return (
    <div className={styles.calendar}>
      <Calendar
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

export default MeetingCalendar;
