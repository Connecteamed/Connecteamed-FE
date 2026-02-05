import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const base = import.meta.env.VITE_SERVER_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? '/api';

export const instance = axios.create({
    // 실제 엔드포인트는 /api/... 이므로 baseURL 뒤에 /api를 붙여줍니다.
    baseURL: base.endsWith('/api') ? base : `${base}/api`,
    withCredentials: true,
});

// 요청마다 로컬 스토리지의 액세스 토큰을 자동으로 붙여줍니다.
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => Promise.reject(error),
);