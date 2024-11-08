import apiClient from '../../../../apis/apiClient';

export const getTeamBuildingList = async (params = {}) => {
    try {
        const response = await apiClient.get('/recruiting/posts', { params });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};