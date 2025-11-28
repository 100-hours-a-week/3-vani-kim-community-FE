import { login } from "/src/features/auth/api/authApi.js";
import { getUser } from "/src/features/user/api/userApi.js";

/**
 * 로그인 폼 제출 이벤트 처리
 * 1. 로그인 API 호출하여 토큰 발급
 * 2. 사용자 정보 API 호출하여 전체 사용자 정보 조회
 * 3. authStore에 토큰과 사용자 정보 저장
 * 4. 메인 페이지 또는 redirect 파라미터로 전달된 페이지로 이동
 */
document.getElementById('login-form').addEventListener('submit', async (event) => {
    // 폼의 기본 동작(페이지 리로드) 방지
    event.preventDefault();

    // 입력된 이메일과 비밀번호 값 가져오기
    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('password').value;

    try {
        // 1. 로그인 API 호출하여 토큰 발급
        const response = await login(emailValue, passwordValue);
        console.log('로그인 응답:', response);

        if (!response?.authHeader) {
            throw new Error('토큰을 받지 못했습니다.');
        }

        // 2. Authorization 헤더에서 Bearer 토큰 추출
        const authHeader = response.authHeader;
        let newAccessToken;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            newAccessToken = authHeader.split('Bearer ')[1];
        }

        if (!newAccessToken) {
            throw new Error('유효하지 않은 토큰 형식입니다.');
        }

        // 3. authStore에 토큰 저장
        if (newAccessToken) {
            window.authStore.setAccessToken(newAccessToken);
            console.log('토큰 저장 성공');
        }

        // 4. 토큰이 설정된 후 사용자 전체 정보 조회
        // (getUser는 내부적으로 accessToken을 사용하여 /users/me 호출)
        try {
            const userData = await getUser();
            window.authStore.setUser(userData);
            console.log('사용자 정보 조회 완료:', userData);
        } catch (userError) {
            console.warn('사용자 정보 조회 실패, 기본 정보만 저장:', userError);
            // 기본 정보만 저장
            window.authStore.setUser({
                nickname: response.nickname
            });
        }

        // 6. 로그인 성공 알림
        alert('로그인 성공');

        // 7. 리다이렉트 처리
        // URL의 redirect 파라미터가 있으면 해당 페이지로, 없으면 메인 페이지로 이동
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || '/index.html';
        window.location.href = redirectPath;

    } catch (error) {
        console.error('로그인 실패:', error);
        if (error.response?.status === 401) {
            alert('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else {
            alert('로그인 중 오류가 발생했습니다.');
        }
    }
});

