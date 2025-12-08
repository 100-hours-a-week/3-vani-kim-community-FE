/**
 * 인증 상태 및 사용자 정보를 관리하는 전역 저장소
 * localStorage를 사용하여 모든 탭에서 사용자 정보 공유
 * 토큰과 사용자 정보 모두 localStorage에 저장
 */
window.authStore = {
    /**
     * 사용자 정보를 localStorage에 저장
     * @param {Object} userData - 사용자 정보 객체
     * @param {number} userData.id - 사용자 ID
     * @param {string} userData.email - 사용자 이메일
     * @param {string} userData.nickname - 사용자 닉네임
     * @param {string} [userData.profileImageKey] - 프로필 이미지 키
     * @param {string} [userData.presignedProfileImageUrl] - 프로필 이미지 URL
     */
    setUser: function(userData) {
        if (!userData) {
            console.warn('authStore.setUser: userData가 제공되지 않았습니다.');
            return;
        }
        localStorage.setItem('currentUser', JSON.stringify(userData));
    },

    /**
     * localStorage에서 사용자 정보를 조회
     * @returns {Object|null} 사용자 정보 객체 또는 null
     */
    getUser: function() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * 사용자 ID만 조회하는 편의 함수
     * @returns {number|null} 사용자 ID 또는 null
     */
    getUserId: function() {
        const user = this.getUser();
        return user ? user.id : null;
    },

    /**
     * 사용자 닉네임만 조회하는 편의 함수
     * @returns {string|null} 사용자 닉네임 또는 null
     */
    getNickname: function() {
        const user = this.getUser();
        return user ? user.nickname : null;
    },

    /**
     * 프로필 이미지 URL만 조회하는 편의 함수
     * @returns {string|null} 프로필 이미지 URL 또는 null
     */
    getProfileImageUrl: function() {
        const user = this.getUser();
        return user ? user.presignedProfileImageUrl : null;
    },

    /**
     * 사용자 정보를 부분적으로 업데이트
     * 기존 정보를 유지하면서 제공된 필드만 업데이트
     * @param {Object} updates - 업데이트할 필드들
     */
    updateUser: function(updates) {
        const currentUser = this.getUser();
        if (!currentUser) {
            console.warn('authStore.updateUser: 저장된 사용자 정보가 없습니다.');
            return;
        }
        const updatedUser = { ...currentUser, ...updates };
        this.setUser(updatedUser);
    },

    /**
     * 모든 인증 관련 데이터를 삭제 (로그아웃 시 사용)
     * - localStorage의 사용자 정보
     * - localStorage의 액세스 토큰
     */
    clearAuth: function() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('accessToken');
    },

    /**
     * 사용자 인증 여부 확인
     * @returns {boolean} 로그인 여부
     */
    isAuthenticated: function() {
        const token = localStorage.getItem('accessToken');
        const user = this.getUser();
        return !!(token && user);
    },

    /**
     * 액세스 토큰만 조회하는 편의 함수
     * @returns {string|null} 액세스 토큰 또는 null
     */
    getAccessToken: function() {
        return localStorage.getItem('accessToken');
    },

    /**
     * 액세스 토큰만 저장하는 편의 함수
     * @param {string} token - 액세스 토큰
     */
    setAccessToken: function(token) {
        if (!token) {
            console.warn('authStore.setAccessToken: 토큰이 제공되지 않았습니다.');
            return;
        }
        localStorage.setItem('accessToken', token);
    }
};