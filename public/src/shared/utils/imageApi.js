import apiClient from "/src/core/api/api.js";

export async function getPresignTempUrl(fileName, contentType, fileSizeByte, category){
    try{
        const response = await apiClient.post(`/uploads/presign/temp`, {
            fileName,
            contentType,
            fileSizeByte,
            category
        })
        return response;
    } catch (error) {
        console.error('업로드 URL 발급 실패', error);
        throw error;
    }
}

export async function getPresignUrl(fileName, contentType, fileSizeByte, category){
    try{
        const response = await apiClient.post(`/uploads/presign`, {
                fileName,
                contentType,
                fileSizeByte,
                category
            });
        return response;
    } catch (error) {
        console.error('업로드 URL 발급 실패', error);
        throw error;
    }
}

//S3 presignedUrl Upload
//PUT으로 요청
//'Authorization' 헤더는 절대 추가 X Presigned URL 자체가 서명된 인증서 역할
export async function uploadToS3(presignedUrl, imageFile) {
    try {
        const response = await fetch(presignedUrl, {
            method: "PUT",

            headers: {
                'Content-Type': imageFile.type
            },
            // json말고 그대로
            body: imageFile
        });

        if (!response.ok) {
            throw new Error(`S3 업로드에 실패했습니다. : ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error('이미지 업로드 실패', error);
        throw error;
    }
}

export async function getFromS3(presignedUrl) {
    try {
        const response = await fetch(presignedUrl, {
            method: "GET",

        });

        if (!response.ok) {
            throw new Error(`S3 불러오기에 실패했습니다. : ${response.status} ${response.statusText}`);
        }

        return await response.blob();
    } catch (error) {
        console.error('이미지 불러오기 실패', error);
        throw error;
    }
}