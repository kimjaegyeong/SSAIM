export const dateToString = (date : Date|string|null) => {
  if(!date){
    return null;
  }
  if (typeof date === 'string') {
    date = new Date(date); // 문자열일 경우 Date 객체로 변환
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}.${month}.${day}`;
}