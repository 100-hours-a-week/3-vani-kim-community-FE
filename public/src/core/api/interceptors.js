let isRefreshing = false; // 토큰 갱신 중 여부 확인용
let failedQueue = []; // 갱신을 기다리는 요청 대기열

// 대기열을 처리하는 함수
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setupInterceptors = (apiClient) => {
    // 요청 인터셉터
    apiClient.interceptors.request.use(
        (config) => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            config.headers['Content-Type'] = 'application/json';
            return config;
        },
        (error) => {
            console.log('Request Interceptor Error: ', error);
            return Promise.reject(error);
        }
    );

    // 응답 인터셉터
    apiClient.interceptors.response.use(
        (response) => {
            if (response.config.returnFullResponse) {
                return response;
            }
            return response.data;
        },
        async (error) => {
            const originalRequest = error.config;

            // 응답 자체가 없거나(네트워크 오류 등), 401이 아니면 그냥 실패 처리
            if (!error.response || error.response.status !== 401) {
                console.error('Axios 실패 (Non-401):', error);
                return Promise.reject(error);
            }

            const errorData = error.response.data || {};

            // [CASE 1] T002 : 토큰 만료 -> 갱신 시도
            if (errorData.code === "T002") {
                if (isRefreshing) {
                    console.log("토큰 갱신 중, 대기열에 추가합니다.");
                    return new Promise((resolve, reject) => {
                        failedQueue.push({
                            resolve: (token) => {
                                originalRequest.headers.authorization = 'Bearer ' + token;
                                resolve(apiClient(originalRequest));
                            },
                            reject: (err) => {
                                reject(err);
                            }
                        });
                    });
                }

                isRefreshing = true;
                originalRequest._isRetry = true;
                console.log("토큰 만료, 갱신 시도(첫 번째)");

                try {
                    // 리프레시 토큰은 쿠키에 있다고 가정 (withCredentials가 필요할 수 있음)
                    const response = await axios.post('/api/v1/auth/refresh', null, {
                        withCredentials: true, // 쿠키(리프레시 토큰) 전송 필수
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const authHeader = response.headers['authorization'] || response.headers['Authorization'];
                    let newAccessToken;
                    if (authHeader && authHeader.startsWith('Bearer ')) {
                        newAccessToken = authHeader.split('Bearer ')[1];
                    }

                    if (newAccessToken) {
                        localStorage.setItem("accessToken", newAccessToken);
                        processQueue(null, newAccessToken);

                        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
                        return apiClient(originalRequest);
                    } else {
                        throw new Error("갱신된 토큰이 없습니다.");
                    }

                } catch (refreshError) {
                    console.error("토큰 갱신 실패, 강제 로그아웃 진행", refreshError);
                    processQueue(refreshError, null);

                    // 🚨 [수정] 갱신 실패 시에도 서버 요청 없이 클라이언트만 정리
                    localStorage.removeItem("accessToken");

                    // 로그인 페이지 경로 확인 필요 (/login 또는 /login/login.html)
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

                // [CASE 2] T001, T003, 그 외 401 : 유효하지 않은 토큰 -> 즉시 튕겨내기
            // (서버에 logout 요청 보내지 않음! 어차피 403/401 뜸)
            else {
                console.warn("유효하지 않은 토큰(또는 기타 401), 강제 로그아웃 처리");

                isRefreshing = false;
                failedQueue = [];
                localStorage.removeItem("accessToken");

                if (!window.location.pathname.includes('/login')) {
                    window.location.href = "/login";
                }

                return Promise.reject(error);
            }
        }
    );
};