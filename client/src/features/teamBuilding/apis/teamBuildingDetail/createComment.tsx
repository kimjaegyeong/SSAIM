import apiClient from "@/apis/apiClient";

export interface createCommentParams {
    userId: number;
    position: number;
    message: string;
}

export const createComment = async(postId:number, params: createCommentParams) => {
    try{
        const response = await apiClient.post(`/recruiting/posts/${postId}/applicants`, params);
        console.log(response.data);
        return response.data;
    } catch (error){
        console.log(error);
        throw error;
    }
}