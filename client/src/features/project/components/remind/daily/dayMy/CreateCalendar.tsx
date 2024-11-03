import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from './CreateCalendar.module.css';

interface CreateCalendarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
  }

const CreateCalendar: React.FC<CreateCalendarProps> = ({ selectedDate, onDateChange }) => {
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
        className={styles.dayCalendar}
      />
    </div>
  );
};

export default CreateCalendar;
