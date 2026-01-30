import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    withCredentials: true,
});

instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);