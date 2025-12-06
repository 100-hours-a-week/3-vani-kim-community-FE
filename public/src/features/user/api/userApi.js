import apiClient from "/src/core/api/api.js";


export async function getUser() {
    try {
        const response = await apiClient.get(`/users/me`);
        return response;
    } catch (error) {
        console.error('유저 조회 실패', error.message);
        throw error;
    }
}

export async function updateUser(nickname, profileImageKey) {
    try {
        const response = await apiClient.patch(`/user/me`, {
            nickname,
            profileImageKey
        });
        return response;
    } catch (error) {
        console.error('유저 정보 수정 실패', error.message);
        throw error;
    }
}

export async function withdrawUser(password) {
    try {
        const response = await apiClient.patch(`/user/me`, {
            password
        });
        return response;
    } catch (error) {
        console.error('유저 탈퇴 실패', error.message);
        throw error;
    }
}