import { creatPost } from "/src/features/posts/api/postApi.js";
import { getPresignUrl, uploadToS3 } from "/src/shared/utils/imageApi.js"
import { renderImagePreview, isFileSizeValid } from "/src/shared/utils/fileUtils.js";
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const DEFAULT_AVATAR_IMAGE = 'assets/user.png'
const MAX_PROFILE_SIZE_MB = 10; //10MB

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if(!file) {
        renderImagePreview(null, imagePreview, DEFAULT_AVATAR_IMAGE);
        return;
    }

    //크기 검사 로직을 util 함수로 대체
    if (!isFileSizeValid(file,MAX_PROFILE_SIZE_MB)) {
        alert(`파일 크기는 ${MAX_PROFILE_SIZE_MB} MB를 초과할 수 없습니다.`);
        imageInput.value = "";
        renderImagePreview(null, imagePreview, DEFAULT_AVATAR_IMAGE);
        return;
    }

    renderImagePreview(file, imagePreview, DEFAULT_AVATAR_IMAGE);
});

// 클릭 이벤트 리스너 추가
// Promise의 반환기다리는 await 쓰려면 async 필수임
// XXX 도메인여러개 쓰면 조심...
document.getElementById('post-form').addEventListener('submit', async (event) => {
    // 폼의 기본 동작 방지하기
    event.preventDefault();

    // JS로 입력 값가져오기
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    //TODO S3 연동해야함+이미지 처리로직
    //입력으로 받은 이미지파일
    const imageFile = document.getElementById('image-input').files[0];
    let postImageKey = null;
    if (imageFile) {
        let presignedUrl;
        //1. Presigned URL 요청(서버)
        try {
            //서버에 Presigned URL 요청
            const presignedData = await getPresignUrl(
                imageFile.name, imageFile.type, imageFile.size, "POST_IMAGE"
            );

            presignedUrl = presignedData.presignedUrl;
            postImageKey = presignedData.objectKey;
        } catch (serverError) {
            console.error('Presigned URL 요청 실패:', serverError);
            // TODO: serverError.response.data.message 처럼 좀 더 구체적으로
            alert('이미지 업로드 준비에 실패했습니다. (파일 크기/타입 확인)');
            return;
        }
        console.log('url요청 끝')
        //2. S3에 업로드

        try {
            await uploadToS3(presignedUrl, imageFile);

        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드 오류, 다시 시도해 주세요.');
            return;
        }
    }

    console.log('s3에 업로드 요청')
    try {
        const newPost = await creatPost(title, content, postImageKey);

        if (newPost) {
            console.log('게시글 생성 성공');
            alert('게시글 생성 성공');
        }

        //받아온 데이터 보관
        sessionStorage.setItem("tempPost", JSON.stringify(newPost));
        window.location.href = `/post/${newPost.postId}`;

    } catch (error) {
        console.log(error);
        alert('게시글 생성에 실패하였습니다.')
    }
});
