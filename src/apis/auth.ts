/**
 * 로그인 API
 * @param loginId 아이디
 * @param password 비밀번호
 */
import type { ApiResponse } from '@/types';
import type { CheckIdData, LoginData, RefreshTokenData, SignupData } from '@/types/auth';
import axios from 'axios';

const API_URL = 'https://api.connecteamed.shop';

export const postLogin = async (loginId: string, password: string) => {
  const response = await axios.post<ApiResponse<LoginData>>(`${API_URL}/api/auth/login`, {
    loginId,
    password,
  });
  return response.data;
};

export const postLogout = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (refreshToken) {
    headers['Refresh-Token'] = refreshToken;
  }

  const response = await axios.post<ApiResponse<null>>(`${API_URL}/api/auth/logout`, null, {
    headers,
  });

  return response.data;
};

export const postSignup = async (signupData: {
  name: string;
  loginId: string;
  password: string;
}) => {
  const response = await axios.post<ApiResponse<SignupData>>(
    `${API_URL}/api/auth/signup`,
    signupData,
  );
  return response.data;
};

export const checkId = async (loginId: string) => {
  const response = await axios.get<ApiResponse<CheckIdData>>(`${API_URL}/api/members/check-id`, {
    params: { loginId },
  });
  return response.data;
};

export const postRefreshToken = async (refreshToken: string) => {
  const response = await axios.post<ApiResponse<RefreshTokenData>>(`${API_URL}/api/auth/refresh`, {
    refreshToken,
  });
  return response.data;
};
