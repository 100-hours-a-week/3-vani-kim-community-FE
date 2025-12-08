import { getPost, updatePost } from "/src/features/posts/api/postApi.js";
import { getPresignUrl, uploadToS3 } from "/src/shared/utils/imageApi.js";
import { renderImagePreview, isFileSizeValid } from "/src/shared/utils/fileUtils.js";
import { showLoading, hideLoading, updateLoadingMessage } from "/src/shared/utils/loadingUtil.js";

// URL에서 게시글 ID 가져오기
const path = window.location.pathname;
const parts = path.split('/');
// /post/:postId/edit 경로에서 postId 추출
const postIdIndex = parts.indexOf('post');
const postId = postIdIndex !== -1 && parts[postIdIndex + 1] ? parts[postIdIndex + 1] : null;

if (!postId) {
    alert('게시글 ID를 찾을 수 없습니다.');
    window.location.href = '/index';
}

const MAX_POST_IMAGE_SIZE_MB = 10; // 10MB

let currentPost = null;
let isCurrentImageRemoved = false; // 기존 이미지 삭제 여부
let newImageFile = null; // 새로 업로드할 이미지 파일

// 페이지 초기화
async function initPage() {
    try {
        // 기존 게시글 데이터 가져오기
        currentPost = await getPost(postId);

        // 폼에 기존 데이터 채우기
        document.getElementById('title').value = currentPost.title;
        document.getElementById('content').value = currentPost.contentDetail.content;

        // 기존 이미지가 있으면 표시
        if (currentPost.contentDetail.postImageUrl) {
            const currentImageSection = document.getElementById('current-image-section');
            const currentImage = document.getElementById('current-image');

            currentImage.src = currentPost.contentDetail.postImageUrl;
            currentImageSection.style.display = 'block';
        }

    } catch (error) {
        console.error('게시글 조회 실패:', error);
        alert('게시글을 불러올 수 없습니다.');
        window.location.href = '/index';
    }
}

// 기존 이미지 삭제 버튼
document.getElementById('remove-current-image')?.addEventListener('click', () => {
    const currentImageSection = document.getElementById('current-image-section');
    currentImageSection.style.display = 'none';
    isCurrentImageRemoved = true;
});

// 새 이미지 선택
const imageInput = document.getElementById('image');
const newImagePreviewSection = document.getElementById('new-image-preview');
const previewImage = document.getElementById('preview-image');

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) {
        newImagePreviewSection.style.display = 'none';
        newImageFile = null;
        return;
    }

    // 파일 크기 검사
    if (!isFileSizeValid(file, MAX_POST_IMAGE_SIZE_MB)) {
        alert(`파일 크기는 ${MAX_POST_IMAGE_SIZE_MB}MB를 초과할 수 없습니다.`);
        imageInput.value = "";
        newImagePreviewSection.style.display = 'none';
        newImageFile = null;
        return;
    }

    // 새 이미지 미리보기
    renderImagePreview(file, previewImage, null);
    newImagePreviewSection.style.display = 'block';
    newImageFile = file;
    
    // 새 이미지를 선택하면 기존 이미지 섹션 숨기기
    const currentImageSection = document.getElementById('current-image-section');
    if (currentImageSection) {
        currentImageSection.style.display = 'none';
    }
    isCurrentImageRemoved = false; // 새 이미지가 있으면 기존 이미지는 무시됨
});

// 새 이미지 삭제 버튼
document.getElementById('remove-new-image')?.addEventListener('click', () => {
    imageInput.value = "";
    newImagePreviewSection.style.display = 'none';
    newImageFile = null;
    
    // 새 이미지를 삭제하면 기존 이미지 섹션 다시 표시
    if (!isCurrentImageRemoved && currentPost?.contentDetail?.postImageUrl) {
        const currentImageSection = document.getElementById('current-image-section');
        if (currentImageSection) {
            currentImageSection.style.display = 'block';
        }
    }
});

// 취소 버튼
document.getElementById('cancel-btn').addEventListener('click', () => {
    if (confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
        window.location.href = `/post/${postId}`;
    }
});

// 게시글 수정 폼 제출
document.getElementById('update-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title) {
        window.toast.warning('제목을 입력해주세요.');
        return;
    }

    if (!content) {
        window.toast.warning('내용을 입력해주세요.');
        return;
    }

    // 즉시 로딩 표시
    showLoading('게시글 수정 준비 중...');

    try {
        let postImageKey = null;

        // 이미지 처리 로직
        if (newImageFile) {
            // 새 이미지를 업로드하는 경우
            try {
                updateLoadingMessage('이미지 업로드 준비 중...');
                const presignedData = await getPresignUrl(
                    newImageFile.name,
                    newImageFile.type,
                    newImageFile.size,
                    "POST_IMAGE"
                );

                updateLoadingMessage('이미지 업로드 중...');
                await uploadToS3(presignedData.presignedUrl, newImageFile);
                postImageKey = presignedData.objectKey;

            } catch (error) {
                console.error('이미지 업로드 실패:', error);
                hideLoading();
                window.toast.error('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
                return;
            }
        } else if (!isCurrentImageRemoved && currentPost.contentDetail.postImageUrl) {
            // 기존 이미지를 유지하는 경우
            // URL에서 키를 추출하거나, 서버가 undefined/null을 받으면 기존 이미지를 유지하도록 처리
            // 일반적으로 서버는 undefined를 받으면 기존 이미지를 유지함
            // URL에서 키 추출 시도
            const imageUrl = currentPost.contentDetail.postImageUrl;
            // URL에서 마지막 경로를 키로 사용 (예: https://.../bucket/key -> key)
            const urlParts = imageUrl.split('/');
            const possibleKey = urlParts[urlParts.length - 1];
            // URL 형식에 따라 키 추출이 가능할 수 있음
            // 서버가 처리할 수 있도록 undefined 전송 (일부 서버는 undefined를 기존 유지로 처리)
            postImageKey = undefined; // 서버에서 undefined를 받으면 기존 이미지 유지
        }
        // else: 이미지가 없는 경우 (기존 이미지 삭제 or 원래 없음) -> postImageKey = null

        // 게시글 수정 API 호출
        // postImageKey가 undefined인 경우 서버에서 기존 이미지를 유지하도록 처리
        updateLoadingMessage('게시글 수정 중...');
        const updatedPost = await updatePost(postId, title, content, postImageKey ?? undefined);

        updateLoadingMessage('완료! 이동 중...');
        window.toast.success('게시글이 수정되었습니다.');
        setTimeout(() => {
            window.location.href = `/post/${postId}`;
        }, 1000);

    } catch (error) {
        console.error('게시글 수정 실패:', error);
        hideLoading();

        if (error.response && error.response.status === 403) {
            window.toast.error('게시글 수정 권한이 없습니다.');
        } else if (error.response && error.response.status === 404) {
            window.toast.error('게시글을 찾을 수 없습니다.');
        } else {
            window.toast.error('게시글 수정에 실패했습니다. 다시 시도해주세요.');
        }
    }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});