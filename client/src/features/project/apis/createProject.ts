import apiClient from '../../../apis/apiClient';
import {ProjectCreateDTO} from '@features/project/types/ProjectDTO'


export const createProject = async(projectData : ProjectCreateDTO) => {
  try{
    await console.log(projectData);
    const response = await apiClient.post('/projects', projectData);
    console.log(response.data);
    return response.data;
  } catch (error){
    console.log(error);
    throw error;
  }
}