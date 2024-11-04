import apiClient from '../../../apis/apiClient';
import {ProjectCreateDTO} from '@features/project/types/ProjectDTO'


export const createProject = async(projectData : ProjectCreateDTO) => {
  try{
    console.log(projectData);
    const response = await apiClient.post('/projects');
    console.log(response);
    return response.data;
  } catch (error){
    console.log(error);
    throw error;
  }
}