import apiClient from '../../../../apis/apiClient';
import { Proposal } from '@features/project/types/output/output'

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

export const setProposal = async (projectId: string, proposal: Proposal) => {
  try {
    // Proposal 객체를 텍스트 형식으로 변환
    const textProposal = formatProposalAsText(proposal);

    const response = await apiClient.patch(`/projects/${projectId}/proposal`, { proposal: textProposal });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Proposal 객체를 텍스트 형식으로 변환하는 함수
const formatProposalAsText = (proposal: Proposal): string => {
  return `Title: ${proposal.title}\nDescription: ${proposal.description}\nBackground: ${proposal.background}\nFeature: ${proposal.feature}\nEffect: ${proposal.effect}`;
};
