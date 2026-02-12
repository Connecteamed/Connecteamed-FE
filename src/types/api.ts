// API 공통 응답 타입
export interface ApiResponse<T> {
  projectId: number;
  status: 'success' | 'error';
  data: T;
  message?: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
  };
}

// API 에러 응답 타입
export interface ApiError {
  success: false;
  message: string;
  errorCode?: string;
}
