import apiClient from "@/apis/apiClient";

export const deletePost = async(postId:number) => {
    try{
        const response = await apiClient.delete(`/recruiting/posts/${postId}`);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}