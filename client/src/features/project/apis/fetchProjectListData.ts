// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient'
import config from '../../../config/config';

export const fetchProjectListData = async (userId: number|null) => {
  console.log('fetch project list data')
  try {
    console.log(userId)
    const response = await apiClient.get(`${config.BASE_URL}/user/${userId}/projects`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
