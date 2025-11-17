import apiClient from "/src/core/api/api.js";

export async function getComments(postId, cursorId, cursorCreatedAt, size){
    try {
        const response = await apiClient.get(`/posts/${postId}/comments`, {
            params: {
                cursorId,
                cursorCreatedAt,
                size
            }
        });
        return response;
    } catch (error) {
        console.error('댓글 목록 조회 실패', error);
        throw error;
    }
}


export async function createComment(postId, content, parentId){
    try {
        const response = await apiClient.post(`/posts/${postId}/comments`, {
        params: {
            postId
        },
            content,
            parentId
        });
        return response;
    } catch (error) {
        console.error('댓글 생성 실패', error);
        throw error;
    }
}


export async function updateComment(postId, commentId, content){
    try {
        const response = await apiClient.patch(
            `/posts/${postId}/comments/${commentId}`, {
            content
        });
        return response;
    } catch (error) {
        console.error('댓글 수정 실패', error);
        throw error;
    }
}


export async function deleteComment(postId, commentId){
    try {
        const response = await apiClient.delete(
            `/posts/${postId}/comments/${commentId}`);
        return response;
    } catch (error) {
        console.error('댓글 삭제 실패', error);
        throw error;
    }
}
