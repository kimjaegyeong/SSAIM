import apiClient from '../../../../apis/apiClient';

export const getFeatureSpec = async(projectId:string) => {
  try{
    const response = await apiClient.get(`/projects/${projectId}/function-description`);
    console.log(response.data);
    return response.data;
  } catch (error){
    console.log(error);
    throw error;
  }
}
