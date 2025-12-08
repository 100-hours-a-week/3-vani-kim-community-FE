import {getUser, withdrawUser, updateUser} from "/src/features/user/api/userApi.js";
import {nicknameCheck} from "/src/features/auth/api/authApi.js";
import { getPresignUrl, uploadToS3 } from "/src/shared/utils/imageApi.js";
import { renderImagePreview, isFileSizeValid } from "/src/shared/utils/fileUtils.js";
import { showLoading, hideLoading, updateLoadingMessage } from "/src/shared/utils/loadingUtil.js";

const DEFAULT_AVATAR_IMAGE = '/assets/images/user.png';
const MAX_PROFILE_SIZE_MB = 10; // 10MB

let currentUser = null;

document.addEventListener("DOMContentLoaded", async function (){
    const user = await getUser();
    currentUser = user;
    const profileImageUrl = user.presignedProfileImageUrl;

    const userImageElem = document.getElementById('profile-image');

    if (userImageElem) {
        userImageElem.src = profileImageUrl || DEFAULT_AVATAR_IMAGE;

        // 기본 이미지를 사용하는 경우 default 클래스 추가
        const imageLabel = userImageElem.closest('.image-upload-label');
        if (imageLabel) {
            if (!profileImageUrl || profileImageUrl === DEFAULT_AVATAR_IMAGE) {
                imageLabel.classList.add('default');
            } else {
                imageLabel.classList.remove('default');
            }
        }
    } else {
        console.warn("'profile-image' <img> 태그를 찾을 수 없습니다.")
    }

    document.getElementById("email").value = user.email;
    document.getElementById("nickname").value = user.nickname;
});

// 이미지 미리보기
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('profile-image');

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if(!file) {
        renderImagePreview(null, imagePreview, DEFAULT_AVATAR_IMAGE);
        return;
    }

    // 크기 검사
    if (!isFileSizeValid(file, MAX_PROFILE_SIZE_MB)) {
        window.toast.warning(`파일 크기는 ${MAX_PROFILE_SIZE_MB} MB를 초과할 수 없습니다.`);
        imageInput.value = "";
        renderImagePreview(null, imagePreview, DEFAULT_AVATAR_IMAGE);
        return;
    }

    renderImagePreview(file, imagePreview, DEFAULT_AVATAR_IMAGE);
});

// 닉네임 검증
const nicknameInput = document.getElementById('nickname')
const nicknameVerified = document.getElementById('nicknameVerified')
const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;

nicknameInput.addEventListener('blur', async (e) => {
    const nicknameValue = nicknameInput.value;
    if (nicknameValue) {
        // 현재 사용자의 닉네임과 같으면 검증 스킵
        if (currentUser && nicknameValue === currentUser.nickname) {
            nicknameVerified.textContent = '';
            nicknameVerified.style.display = 'none';
            return;
        }

        if (nicknameRegex.test(nicknameValue)) {
            try{
                await nicknameCheck(nicknameValue);
                nicknameVerified.textContent = '사용 가능한 닉네임입니다.';
                nicknameVerified.style.color = 'green';
                nicknameVerified.style.display = 'block';
            } catch (e) {
                nicknameVerified.textContent = '이미 존재하는 닉네임입니다.';
                nicknameVerified.style.color = 'red';
                nicknameVerified.style.display = "block";
            }
        } else {
            nicknameVerified.textContent = '올바른 닉네임형식이 아닙니다.';
            nicknameVerified.style.color = 'red';
            nicknameVerified.style.display = 'block';
        }
    } else {
        nicknameVerified.textContent = '';
        nicknameVerified.style.display = 'none';
    }
});

// 폼 제출
document.getElementById('user-profile-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // 즉시 로딩 표시
    showLoading('프로필 수정 준비 중...');

    try {
        const nicknameValue = nicknameInput.value;
        const imageFile = imageInput.files[0];
        let profileImageKey = null;

        // 이미지 파일이 선택된 경우에만 업로드
        if (imageFile) {
            let presignedUrl;

            // 1. Presigned URL 요청
            try {
                updateLoadingMessage('프로필 이미지 업로드 준비 중...');
                const presignedData = await getPresignUrl(
                    imageFile.name,
                    imageFile.type,
                    imageFile.size,
                    "PROFILE_IMAGE"
                );

                presignedUrl = presignedData.presignedUrl;
                profileImageKey = presignedData.objectKey;
            } catch (serverError) {
                console.error('Presigned URL 요청 실패:', serverError);
                hideLoading();
                window.toast.error('이미지 업로드 준비에 실패했습니다. (파일 크기/타입 확인)');
                return;
            }

            // 2. S3에 업로드
            try {
                updateLoadingMessage('프로필 이미지 업로드 중...');
                await uploadToS3(presignedUrl, imageFile);
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                hideLoading();
                window.toast.error('이미지 업로드 오류, 다시 시도해 주세요.');
                return;
            }
        }

        // 3. 프로필 업데이트 API 호출
        updateLoadingMessage('프로필 업데이트 중...');
        await updateUser(nicknameValue, profileImageKey);

        // 서버에서 최신 사용자 정보를 가져와 authStore 업데이트
        const updatedUser = await getUser();
        window.authStore.setUser(updatedUser);

        updateLoadingMessage('완료! 페이지 새로고침 중...');
        window.toast.success('프로필이 성공적으로 업데이트되었습니다!');

        setTimeout(() => {
            window.location.reload();
        }, 1500);
    } catch (error) {
        console.error('프로필 업데이트 실패:', error);
        hideLoading();
        window.toast.error('프로필 업데이트에 실패했습니다.');
    }
});
