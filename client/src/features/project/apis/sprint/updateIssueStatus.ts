import apiClient from '@/apis/apiClient'

export const updateIssueStatus = async (projectId: number, issueKey : string, status:'todo'|'inProgress'|'done') => {
  try {
    const response = await apiClient.post(`/projects/${projectId}/issue/${issueKey}?status=${status}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
