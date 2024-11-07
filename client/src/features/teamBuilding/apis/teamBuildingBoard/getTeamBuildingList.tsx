import apiClient from '../../../../apis/apiClient';

export const getTeamBuildingList = async() => {
    try{
        const response = await apiClient.get('/recruiting/posts');
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}