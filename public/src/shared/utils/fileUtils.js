
/**
 * File 객체를 읽어 <img> 태그에 미리보기를 렌더링
 * @param {File} file - input에서 선택한 파일 객체
 * @param {HTMLImageElement} previewImgElement - 미리보기를 표시할 <img> 요소
 * @param {string} defaultSrc - 파일이 없거나 취소 됐을 때 표시할 기본 이미지 경로
 * */
export function renderImagePreview(file, previewImgElement, defaultSrc) {
    if (file) {
        const reader = new FileReader();
        //파일 읽기가 완료되었을 때 실행될 콜백 함수
        reader.onload = (event) => {
            previewImgElement.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        previewImgElement.src = defaultSrc;
    }
}

/**
 * 파일크기가 최대 용량을 초과하는지 검사
 * @param {File} file - 검사할 파일 객체
 * @param {number} maxSizeInMB - 최대 허용 용량{MB 단위}
 * @return {boolean} - 유효하면 true, 초과하면 false
 * */
export function isFileSizeValid(file, maxSizeInMB) {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    console.log('maxSizeInMB', maxSizeInMB, maxSizeInBytes, file.size);
    return file.size <= maxSizeInBytes;
}