import { setupInterceptors } from '/src/core/api/interceptors.js';

const API_URL = "http://localhost:8080/api/v1";
// 배포할 때는 localhost:8080하면 안된다.
// const API_URL = "/api/v1";

//axios 인스턴스 생성
//응답대기 5초
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    withCredentials: true
});

setupInterceptors(apiClient);

export default apiClient;

