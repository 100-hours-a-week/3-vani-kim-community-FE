import apiClient from "/src/core/api/api.js";

const updatePasswordButton = document.getElementById('update-password-button');

let validationState = {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
}

function checkFormValidity() {
    const allValid = Object.values(validationState).every(status => status === true);
    updatePasswordButton.disabled = !allValid;
}

// 비밀번호 포맷 검증 정규식
const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~]{8,20}$/

// 1. 현재 비밀번호 입력 검증
const currentPasswordInput = document.getElementById('current-password');
const currentPasswordVerified = document.getElementById('currentPasswordVerified');

currentPasswordInput.addEventListener('blur', (e) => {
    const currentPasswordValue = currentPasswordInput.value;

    if (currentPasswordValue) {
        currentPasswordVerified.textContent = '';
        currentPasswordVerified.style.display = 'none';
        validationState.currentPassword = true;
    } else {
        currentPasswordVerified.textContent = '현재 비밀번호를 입력해주세요.';
        currentPasswordVerified.classList.add('error');
        currentPasswordVerified.style.display = 'block';
        validationState.currentPassword = false;
    }
    checkFormValidity();
});

// 2. 새 비밀번호 포맷 검증
const newPasswordInput = document.getElementById('new-password');
const newPasswordVerified = document.getElementById('newPasswordVerified');

newPasswordInput.addEventListener('blur', (e) => {
    const newPasswordValue = newPasswordInput.value;
    const currentPasswordValue = currentPasswordInput.value;

    if (newPasswordValue) {
        if (newPasswordValue === currentPasswordValue) {
            newPasswordVerified.textContent = '새 비밀번호는 현재 비밀번호와 달라야 합니다.';
            newPasswordVerified.classList.remove('success');
            newPasswordVerified.classList.add('error');
            newPasswordVerified.style.display = 'block';
            validationState.newPassword = false;
        } else if (passwordRegex.test(newPasswordValue)) {
            newPasswordVerified.textContent = '사용 가능한 비밀번호입니다.';
            newPasswordVerified.classList.remove('error');
            newPasswordVerified.classList.add('success');
            newPasswordVerified.style.display = 'block';
            validationState.newPassword = true;
        } else {
            newPasswordVerified.textContent = '올바른 비밀번호형식이 아닙니다. 영어, 숫자, 특수문자를 하나 이상 포함한 8-20자 이상이어야합니다.';
            newPasswordVerified.classList.remove('success');
            newPasswordVerified.classList.add('error');
            newPasswordVerified.style.display = 'block';
            validationState.newPassword = false;
        }
    } else {
        newPasswordVerified.textContent = '';
        newPasswordVerified.style.display = 'none';
        validationState.newPassword = false;
    }

    // 새 비밀번호가 변경되면 확인 비밀번호도 초기화
    confirmPasswordVerified.textContent = '';
    confirmPasswordVerified.style.display = 'none';
    validationState.confirmPassword = false;

    checkFormValidity();
});

// 3. 새 비밀번호 확인 검증
const confirmPasswordInput = document.getElementById('confirm-password');
const confirmPasswordVerified = document.getElementById('confirmPasswordVerified');

confirmPasswordInput.addEventListener('blur', (e) => {
    const newPasswordValue = newPasswordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;

    if (validationState.newPassword && confirmPasswordValue) {
        if (newPasswordValue === confirmPasswordValue) {
            confirmPasswordVerified.textContent = '비밀번호가 일치합니다.';
            confirmPasswordVerified.classList.remove('error');
            confirmPasswordVerified.classList.add('success');
            confirmPasswordVerified.style.display = 'block';
            validationState.confirmPassword = true;
        } else {
            confirmPasswordVerified.textContent = '비밀번호가 일치하지 않습니다.';
            confirmPasswordVerified.classList.remove('success');
            confirmPasswordVerified.classList.add('error');
            confirmPasswordVerified.style.display = 'block';
            validationState.confirmPassword = false;
        }
    } else {
        confirmPasswordVerified.textContent = '';
        confirmPasswordVerified.style.display = 'none';
        validationState.confirmPassword = false;
    }
    checkFormValidity();
});

// 4. 비밀번호 수정 폼 제출
document.getElementById('update-password-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentPasswordValue = currentPasswordInput.value;
    const newPasswordValue = newPasswordInput.value;

    try {
        // 비밀번호 수정 API 호출
        await apiClient.patch(`/auth/users/password`, {
            currentPassword: currentPasswordValue,
            newPassword: newPasswordValue,
        });

        alert('비밀번호가 성공적으로 수정되었습니다.');

        // 토큰 삭제 및 로그인 페이지로 이동
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';

    } catch (error) {
        console.error('비밀번호 수정 실패:', error);

        // 현재 비밀번호가 틀린 경우
        if (error.response && error.response.status === 401) {
            currentPasswordVerified.textContent = '현재 비밀번호가 올바르지 않습니다.';
            currentPasswordVerified.classList.add('error');
            currentPasswordVerified.style.display = 'block';
        } else {
            alert('비밀번호 수정에 실패했습니다. 다시 시도해주세요.');
        }
    }
});