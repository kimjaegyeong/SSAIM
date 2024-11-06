import apiClient from '@/apis/apiClient';
import config from '@/config/config';
import { SprintRemindPostDTO } from '@features/project/types/remind/SprintRemndDTO';

export const createSprintRemind = async (projectId: number, sprintRemindpostData: SprintRemindPostDTO) => {
  try {
    console.log(sprintRemindpostData);
    const response = await apiClient.post(`${config.BASE_URL}/projects/${projectId}/weekly-remind`, sprintRemindpostData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating sprint remind:", error);
    throw error;
  }
};
