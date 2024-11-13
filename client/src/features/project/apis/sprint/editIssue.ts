import apiClient from '@/apis/apiClient'
import config from '@/config/config';
import { IssueEditDTO } from '../../types/sprint/IssueEditDTO';
export const editIssue = async (projectId: number, requestBody: IssueEditDTO) => {
  try {
    const response = await apiClient.put(`${config.BASE_URL}/projects/${projectId}/issue`, requestBody);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
