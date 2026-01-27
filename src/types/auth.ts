import type { ApiResponse } from './api';

export interface LoginData {
  memberId: number;
  acessToken: string;
  refreshToken: string;
  grantType: string;
  expiresIn: number;
}

export interface SignupData {
  memberId: number;
  name: string;
}

export interface CheckIdData {
  available: boolean;
}

export type LoginResponse = ApiResponse<LoginData>;
export type SignupResponse = ApiResponse<SignupData>;
export type CheckIdResponse = ApiResponse<CheckIdData>;
