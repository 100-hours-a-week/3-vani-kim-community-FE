/**
 * 인증이 필요한 페이지에서 로그인 여부를 확인하는 가드
 * 로그인되지 않은 사용자를 로그인 페이지로 리다이렉트
 *
 * 사용법: 보호가 필요한 HTML 페이지에서 이 스크립트를 import
 * <script type="module" src="/src/features/auth/authGuard.js"></script>
 */
(function() {
    // 로컬 스토리지에서 액세스 토큰 확인
    const accessToken = localStorage.getItem("accessToken");

    // 토큰이 없으면 (로그인하지 않은 경우)
    if (!accessToken) {
        alert('로그인이 필요한 페이지입니다.');

        // 현재 페이지 경로를 redirect 파라미터로 전달하여 로그인 페이지로 이동
        // 로그인 후 원래 페이지로 돌아올 수 있도록 함
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
})();
// IIFE (즉시 실행 함수)로 감싸서 전역 스코프 오염 방지
