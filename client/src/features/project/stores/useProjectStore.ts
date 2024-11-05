import {create} from 'zustand';
import {ProjectDTO} from '@features/project/types/ProjectDTO'


interface ProjectState {
  projectList : ProjectDTO[];
  setProjectList : (projectList:ProjectDTO[]) => void;
}

const useProjectStore = create<ProjectState>(

  (set) => ({
    projectList : [],
    setProjectList : (projectList) => {
      set({
        projectList : projectList
      })
    },
  })
)
export default useProjectStore;