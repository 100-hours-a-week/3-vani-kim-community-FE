// /src/core/api/lambdaClient.js
import { setupInterceptors } from './interceptors.js';

const lambdaClient = axios.create({
    baseURL: 'https://image.vanicommu.click',
    timeout: 10000,
    withCredentials: false
});

// ✅ 같은 인터셉터 적용 (토큰 갱신 로직 포함)
setupInterceptors(lambdaClient);

export default lambdaClient;