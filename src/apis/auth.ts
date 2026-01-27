/**
 * 로그인 API
 * @param loginId 아이디
 * @param password 비밀번호
 */
import type { ApiResponse } from '@/types';
import type { CheckIdData, LoginData, SignupData } from '@/types/auth';
import axios from 'axios';

const API_URL = 'https://api.connecteamed.shop';

export const postLogin = async (loginId: string, password: string) => {
  const response = await axios.post<ApiResponse<LoginData>>(`${API_URL}/api/auth/login`, {
    loginId,
    password,
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
