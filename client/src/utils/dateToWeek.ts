import { startOfMonth, differenceInWeeks, format } from 'date-fns';


export const dateToWeek = (date : Date|string) => {
    const startOfMonthDate = startOfMonth(date);
    const weekNumber = differenceInWeeks(date, startOfMonthDate) + 1;
  
    return `${format(date, 'yyyy년 M월')} ${weekNumber}주차`;
}