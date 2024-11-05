import apiClient from '../../../apis/apiClient';
import config from '../../../config/config';

export const userSearchAPI = async (input: string, searchBy: 'userName' | 'userEmail' | 'userNickname') => {
  try {
    console.log(`Searching by ${searchBy}: ${input}`);
    
    const response = await apiClient.get(`${config.BASE_URL}/users?${searchBy}=${input}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
