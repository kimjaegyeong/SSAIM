import apiClient from '@/apis/apiClient'
import config from '@/config/config';
import { SpeakersPutDTO } from '@features/project/types/meeting/MeetingDTO';

export const editSpeakers = async (projectId: number, meetingId: number, speakersPutDTO:SpeakersPutDTO) => {
  try {
    const response = await apiClient.put(`${config.BASE_URL}/projects/${projectId}/meetings/${meetingId}`, speakersPutDTO);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
