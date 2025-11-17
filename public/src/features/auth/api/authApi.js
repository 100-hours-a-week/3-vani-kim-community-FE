import apiClient from "/src/core/api/api.js";

//회원가입 요청
export async function signup(email, password, nickname, profileImageKey) {
    try {
        const response = await apiClient.post(`/auth/users`, {
            email,
            password,
            nickname,
            profileImageKey
        });
        return response;
    } catch (error) {
        console.error('회원 가입 실패', error.message);
        throw error;
    }
}

//로그인 요청
export async function login(email, password) {
    try {
        const response = await apiClient.post(`/auth/tokens`, {
            email,
            password,
        }, {
            returnFullResponse: true // 로그인 해더 처리를 위해 data말고 응답반환을 시키는 플래그
        });
        return {
            nickname : response.data.nickname,
            authHeader : response.headers.authorization,
        }
    } catch (error) {
        console.error('로그인 실패', error.message);
        throw error;
    }
}

// 로그아웃 요청
// TODO 쿠키 삭제.
export async function logout() {
    try {
        const response = await apiClient.post(`/auth/logout`);
        return response;
    } catch (error) {
        console.error('로그아웃 실패', error.message);
        throw error;
    }
}

//이메일 중복 검증 TODO 다른 메서드 HEAD등 고민
export async function emailCheck(email) {
    try {
        const response = await apiClient.get(`/auth/email`, {
            params: {
                email,
            }
        });
        return response;
    } catch (error) {
        console.error('이메일 중복 검증 실패', error.message);
        throw error;
    }
}

//닉네임 중복 검증
export async function nicknameCheck(nickname) {
    try {
        const response = await apiClient.get(`/auth/nickname`, {
            params: {
                nickname,
            }
        });
        return response;
    } catch (error) {
        console.error('닉네임 중복 검증 실패', error.message);
        throw error;
    }
}