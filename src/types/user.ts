// 사용자 기본 정보
export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
  createdAt: string;
}

// 로그인 응답
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
