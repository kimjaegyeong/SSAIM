import apiClient from "@/apis/apiClient";

export const getPostInfo = async(postId:number) => {
    try{
        const response = await apiClient.get(`/recruiting/posts/${postId}`);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}