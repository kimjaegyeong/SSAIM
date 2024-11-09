import apiClient from '../../../../apis/apiClient';

export const getProposal = async(projectId:string) => {
  try{
    const response = await apiClient.get(`/projects/${projectId}/proposal`);
    console.log(response.data);
    return response.data;
  } catch (error){
    console.log(error);
    throw error;
  }
}
