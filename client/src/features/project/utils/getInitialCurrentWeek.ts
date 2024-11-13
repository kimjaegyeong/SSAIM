export const getInitialCurrentWeek = (weekList: any[]) => {
  if (weekList.length === 0) return 0;
  console.log(weekList)
  const today = new Date();
  for (let i = 0; i < weekList.length; i++) {
    const { startDate, endDate } = weekList[i];
    if (new Date(startDate) <= today && today <= new Date(endDate)) {
      console.log(startDate, endDate, i)
      return i; // 현재 날짜에 포함된 주차를 반환
    }
  }
  return weekList.length - 1; // 현재 날짜가 범위에 없으면 마지막 주차로 설정
};
