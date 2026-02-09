/**
 * 로그인 API
 * @param loginId 아이디
 * @param password 비밀번호
 */
import type { ApiResponse } from '@/types';
import type { CheckIdData, LoginData, RefreshTokenData, SignupData } from '@/types/auth';
import { instance } from './axios';

export type SocialProvider = 'google' | 'kakao';

export const getSocialLoginUrl = (provider: SocialProvider) =>
  `${instance.defaults.baseURL}/auth/login/${provider}`;

export const postLogin = async (loginId: string, password: string) => {
  const response = await instance.post<ApiResponse<LoginData>>('/auth/login', {
    loginId,
    password,
  });
  return response.data;
};

export const postLogout = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    return {
      status: 'error',
      data: null,
      message: '토큰이 없습니다. 다시 로그인해주세요.',
    } as ApiResponse<null>;
  }

  const response = await instance.post<ApiResponse<null>>('/auth/logout', null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Refresh-Token': refreshToken,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const postSignup = async (signupData: {
  name: string;
  loginId: string;
  password: string;
}) => {
  const response = await instance.post<ApiResponse<SignupData>>('/auth/signup', signupData);
  return response.data;
};

export const checkId = async (loginId: string) => {
  const response = await instance.get<ApiResponse<CheckIdData>>('/members/check-id', {
    params: { loginId },
  });
  return response.data;
};

export const postRefreshToken = async (refreshToken: string) => {
  const response = await instance.post<ApiResponse<RefreshTokenData>>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};
