/**
 * Toast Notification System
 *
 * 사용법:
 * toast.success('성공 메시지');
 * toast.error('에러 메시지');
 * toast.warning('경고 메시지');
 * toast.info('정보 메시지');
 */

class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.init();
    }

    init() {
        // 토스트 컨테이너 생성
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    /**
     * 토스트 표시
     * @param {string} message - 표시할 메시지
     * @param {string} type - 토스트 타입 (success, error, warning, info)
     * @param {number} duration - 표시 시간 (ms)
     */
    show(message, type = 'info', duration = 3000) {
        const toast = this.createToast(message, type, duration);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Lucide 아이콘 렌더링
        if (window.lucide) {
            lucide.createIcons();
        }

        // 애니메이션을 위해 약간의 딜레이
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // 자동 제거
        const autoRemoveTimer = setTimeout(() => {
            this.remove(toast);
        }, duration);

        // 토스트에 타이머 저장 (수동 닫기 시 취소하기 위해)
        toast._autoRemoveTimer = autoRemoveTimer;
    }

    /**
     * 토스트 DOM 생성
     */
    createToast(message, type, duration) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // 아이콘 선택
        const iconName = this.getIconName(type);

        toast.innerHTML = `
            <div class="toast-icon">
                <i data-lucide="${iconName}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="닫기">
                <i data-lucide="x"></i>
            </button>
            <div class="toast-progress" style="width: 100%; transition-duration: ${duration}ms;"></div>
        `;

        // 닫기 버튼 이벤트
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(toast);
        });

        // Progress bar 애니메이션
        setTimeout(() => {
            const progress = toast.querySelector('.toast-progress');
            if (progress) {
                progress.style.width = '0%';
            }
        }, 10);

        return toast;
    }

    /**
     * 타입별 아이콘 이름 반환
     */
    getIconName(type) {
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || 'info';
    }

    /**
     * 토스트 제거
     */
    remove(toast) {
        // 자동 제거 타이머 취소
        if (toast._autoRemoveTimer) {
            clearTimeout(toast._autoRemoveTimer);
        }

        // 애니메이션
        toast.classList.remove('show');
        toast.classList.add('hide');

        // DOM에서 제거
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            // 배열에서 제거
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    /**
     * 모든 토스트 제거
     */
    clearAll() {
        this.toasts.forEach(toast => this.remove(toast));
    }

    // 편의 메서드
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    error(message, duration = 4000) {
        this.show(message, 'error', duration);
    }

    warning(message, duration = 3500) {
        this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }

    /**
     * 확인 모달 표시
     * @param {string} title - 모달 제목
     * @param {string} message - 모달 메시지
     * @param {Object} options - 옵션 { confirmText: '확인', cancelText: '취소' }
     * @returns {Promise<boolean>} - 확인 시 true, 취소 시 false
     */
    confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const {
                confirmText = '확인',
                cancelText = '취소'
            } = options;

            // 모달 DOM 생성
            const modal = document.createElement('div');
            modal.className = 'confirm-modal';
            modal.innerHTML = `
                <div class="confirm-backdrop"></div>
                <div class="confirm-content">
                    <div class="confirm-icon">
                        <i data-lucide="alert-circle"></i>
                    </div>
                    <h3 class="confirm-title">${title}</h3>
                    <p class="confirm-message">${message}</p>
                    <div class="confirm-buttons">
                        <button class="confirm-btn confirm-btn-cancel">${cancelText}</button>
                        <button class="confirm-btn confirm-btn-confirm">${confirmText}</button>
                    </div>
                </div>
            `;

            // DOM에 추가
            document.body.appendChild(modal);

            // Lucide 아이콘 렌더링
            if (window.lucide) {
                lucide.createIcons();
            }

            // 모달 표시
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

            // 모달 닫기 함수
            const closeModal = (result) => {
                modal.classList.remove('show');
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                    resolve(result);
                }, 300);
            };

            // 이벤트 리스너
            const backdrop = modal.querySelector('.confirm-backdrop');
            const cancelBtn = modal.querySelector('.confirm-btn-cancel');
            const confirmBtn = modal.querySelector('.confirm-btn-confirm');

            backdrop.addEventListener('click', () => closeModal(false));
            cancelBtn.addEventListener('click', () => closeModal(false));
            confirmBtn.addEventListener('click', () => closeModal(true));

            // ESC 키로 닫기
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeModal(false);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }
}

// 전역 인스턴스 생성
const toast = new ToastManager();

// 전역으로 export
window.toast = toast;

export default toast;
