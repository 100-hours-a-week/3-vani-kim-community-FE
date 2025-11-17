let isRefreshing = false; // 토큰 갱신 중 여부 확인용
let failedQueue = []; // 갱신을 기다리는 요청 대기열

//대기열을 처리하는 함수
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error); // 갱신 실패 시, 기다리던 요청들도 실패 처리
        } else {
            prom.resolve(token); // 갱신 성공시, 새 토큰으로 요청 재시도
        }
    });
    failedQueue = [] // 대기열 비우기
};

//TODO promise 객체로 리팩터링 하기
export const setupInterceptors = (apiClient) => {
    //요청 인터셉터
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
            console.log('Request Interceptor Error: ',error);
            return Promise.reject(error);
        }
    );

    //응답 인터셉터
    //TODO 갱신 요청은 필터 없이들어가서 오류의 형식이달라 문제 발생
    //요청 대기열, 게시글 상세페이지등 한페이지에 여러 api요청이 있으면 여러번 갱신 요청 방지
    apiClient.interceptors.response.use(
        //성공적인 응답
        //204 같은건 자동처리
        (response) => {
            console.log('Axios 성공:', response.status);
            if (response.config.returnFullResponse) {
                return response;
            }
            return response.data;
        },
        //실패한 응답
        async (error) => {
            const originalRequest = error.config;

            // 401 에러가 아니거나, data가 없으면 그냥 실패 처리
            if (error.response.status !== 401 || !error.response.data) {
                console.error('Axios 실패, (Non-401):', error, error.response?.status, error.response.data);
                return Promise.reject(error);
            }

            const errorData = error.response.data;

            //T002 : 토큰 갱신 로직
            if (errorData.code === "T002") {

                //지금 갱신 중이라면
                if (isRefreshing) {
                    console.log("토큰 갱신 중, 대기열에 추가합니다.");
                    //갱신 완료시까지 Promise반환하며 대기
                    return new Promise((resolve, reject) => {
                        failedQueue.push(
                            //failed Queue 에 추가될 객체
                            //resolve와 reject라는 두 개의 키를 가짐
                            //이 키들의 값으로 함수를 할당
                            {
                                resolve: (token) => {
                                    // 갱신 성공시 원래 요청 재시도하기
                                    originalRequest.headers.authorization = 'Bearer ' + token;
                                    resolve(apiClient(originalRequest));
                                },
                                reject: (err)=> {
                                    reject(err);
                                }
                            });
                    });

                }
                // 첫 401을 받았을 경우
                isRefreshing = true; // 갱신 시작(플래그 true)
                originalRequest._isRetry = true; // 무한 루프 방지용
                console.log("토큰 만료, 갱신 시도(첫 번째)")

                try {
                    const response = await apiClient.post(`/auth/refresh`, null, {
                        returnFullResponse: true // 인증 토큰 관련 로직용 플래그
                    });
                    // 헤더에서 토큰 추출
                    const authHeader = response.headers.authorization;
                    let newAccessToken;
                    if (authHeader && authHeader.startsWith('Bearer ')) {
                        newAccessToken = authHeader.split('Bearer ')[1];
                    }
                    // 로컬 스토리지에 저장
                    localStorage.setItem("accessToken", newAccessToken);

                    //갱신 성공, 대기열 요청 처리
                    processQueue(null, newAccessToken);

                    // 큐에있던 실패했던 원래 요청도 새 토큰으로 재시도
                    originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    console.error("토큰 갱신 실패, 재로그인", refreshError);

                    //대기열 요청 전부 실패 처리
                    processQueue(refreshError, null);

                    //logout 요청, 서버 토큰 정리, 로그인 페이지 이동
                    await apiClient.post(`/auth/logout`);
                    if (window.location.pathname !== '/login') {
                        window.location.href = "/login";
                    }
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false; //갱신 작업 완료
                }
            }
            // T001, T003: 유효하지 않은 토큰, 즉시 로그아웃
            else if (errorData.code===`T001`||errorData.code===`T003`) {
                console.error("유효하지 않은 토큰, 로그아웃", errorData.message);
                // 플래그와 큐 초기화
                // 다른 요청이 존재할 수도 있으니
                isRefreshing = false;
                failedQueue = [];

                await apiClient.post(`/auth/logout`);
                window.location.href = "/login";
                return Promise.reject(error);
            }
            console.error(`Axios 실패 (401 이외): `, error.response.status, error.response.data);
            return Promise.reject(error);
        }
    );
}

