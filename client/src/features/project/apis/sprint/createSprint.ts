import apiClient from '@/apis/apiClient';
import { SprintCreateDTO, SprintDTO } from '@features/project/types/SprintDTO';

export const createSprint = (projectId: number, sprintData: SprintCreateDTO): Promise<any> => {
  return apiClient.post(`/projects/${projectId}/sprint`, sprintData)
    .then(response => {
      console.log(response.data);
      return response.data as SprintDTO;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
};
