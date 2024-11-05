import apiClient from '../../../apis/apiClient';
import {SignUpFormData} from '@features/user/types/userTypes'

export const signUp = async (signUpData : SignUpFormData) => {
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