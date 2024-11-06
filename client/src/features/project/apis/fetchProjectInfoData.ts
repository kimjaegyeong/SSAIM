// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient'
import config from '../../../config/config';

export const fetchProjectInfoData = async (projectId: number) => {
  console.log('fetch project info data')
  try {
    const response = await apiClient.get(`${config.BASE_URL}/projects/${projectId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
