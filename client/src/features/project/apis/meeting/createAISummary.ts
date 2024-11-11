import apiClient from '@/apis/apiClient'
import config from '@/config/config';

export const createAISummary = async (projectId: number, meetingId: number) => {
  try {
    const response = await apiClient.post(`${config.BASE_URL}/projects/${projectId}/meetings/${meetingId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
