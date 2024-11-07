import { create } from 'zustand';
import { ProjectDTO } from '@features/project/types/ProjectDTO';

interface ProjectWithWeeks extends ProjectDTO {
  weeks: Array<{ startDate: Date; endDate: Date }>;
}

interface ProjectState {
  projectList: ProjectWithWeeks[];
  setProjectList: (projectList: ProjectDTO[]) => void;
}

// 주차 리스트 계산 함수
const calculateWeeks = (start: Date, end: Date): Array<{ startDate: Date; endDate: Date }> => {
  const weeks = [];
  const currentStart = new Date(start);

  // 시작일이 주중일 경우 그 주의 월요일로 설정
  if (currentStart.getDay() !== 1) {
    currentStart.setDate(currentStart.getDate() - (currentStart.getDay() === 0 ? 6 : currentStart.getDay() - 1));
  }

  while (currentStart <= end) {
    const weekEnd = new Date(currentStart);
    weekEnd.setDate(currentStart.getDate() + 6); // 월요일에서 일요일까지

    weeks.push({
      startDate: new Date(currentStart),
      endDate: weekEnd > end ? new Date(end) : weekEnd,
    });

    currentStart.setDate(currentStart.getDate() + 7); // 다음 주로 이동
  }

  return weeks;
};

const useProjectStore = create<ProjectState>((set) => ({
  projectList: [],
  setProjectList: (projectList) => {
    const projectListWithWeeks = projectList.map((project) => ({
      ...project,
      weeks: calculateWeeks(new Date(project.startDate as Date), new Date(project.endDate as Date)),
    }));
    set({ projectList: projectListWithWeeks });
    console.log(projectListWithWeeks)
  },
}));

export default useProjectStore;
