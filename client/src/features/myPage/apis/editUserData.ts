// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient';
import { UserInfoEditDTO } from '@features/user/types/UserInfoDTO';

export const editUserData = async (userId: number | null, userInfoUpdates: UserInfoEditDTO) => {
  console.log('patch user info data');
  if (!userId) {
    console.log('userId is required');
    return;
  }
  try {
    console.log(userInfoUpdates);
    const response = await apiClient.patch(`/users/${userId}`, userInfoUpdates);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
