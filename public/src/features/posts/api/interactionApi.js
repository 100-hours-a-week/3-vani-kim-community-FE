import apiClient from "/src/core/api/api.js";

export async function like(postId){
    try {
        const response = await apiClient.post(`/post/${postId}/likes`, {
            params: {
                postId
            }
        })
        return response;
    } catch (error) {
        console.error('좋아요 토글 실패', error);
        throw error;
    }
}
