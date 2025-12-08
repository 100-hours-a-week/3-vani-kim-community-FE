/**
 * 전체 화면 로딩 오버레이를 표시/숨기는 유틸리티
 */

let loadingOverlay = null;

/**
 * 로딩 오버레이를 표시
 * @param {string} message - 로딩 중 표시할 메시지 (기본: "처리 중...")
 */
export function showLoading(message = "처리 중...") {
    // 이미 로딩 오버레이가 있으면 메시지만 업데이트
    if (loadingOverlay) {
        const messageElement = loadingOverlay.querySelector('.loading-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
        return;
    }

    // 로딩 오버레이 생성
    loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner-container">
            <div class="loading-spinner"></div>
            <p class="loading-message">${message}</p>
        </div>
    `;

    document.body.appendChild(loadingOverlay);

    // 애니메이션을 위해 약간의 지연 후 active 클래스 추가
    setTimeout(() => {
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }, 10);
}

/**
 * 로딩 오버레이를 숨김
 */
export function hideLoading() {
    if (!loadingOverlay) return;

    loadingOverlay.classList.remove('active');

    // 애니메이션이 끝난 후 DOM에서 제거
    setTimeout(() => {
        if (loadingOverlay && loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
            loadingOverlay = null;
        }
    }, 300);
}

/**
 * 로딩 메시지만 업데이트
 * @param {string} message - 새로운 메시지
 */
export function updateLoadingMessage(message) {
    if (!loadingOverlay) return;

    const messageElement = loadingOverlay.querySelector('.loading-message');
    if (messageElement) {
        messageElement.textContent = message;
    }
}
