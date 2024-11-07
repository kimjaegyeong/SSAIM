import apiClient from '../../../apis/apiClient';
import {BaseUserDTO} from '@features/user/types/UserInfoDTO'

export const signUp = async (signUpData : BaseUserDTO) => {
  console.log(signUpData)
  try {
    const response = await apiClient.post('/users', signUpData);
    console.log('sign up success!')
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to signup');
  }
}