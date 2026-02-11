import type { ApiResponse } from './api';

// AI 회고 생성 요청 타입
export interface CreateAIRetroRequest {
  title: string;
  projectResult: string;
  taskIds: number[];
}

// AI 회고 생성 응답 데이터 타입
export interface CreateAIRetroData {
  retrospectiveId: number;
  title: string;
}

// AI 회고 생성 전체 응답 타입
export type CreateAIRetroResponse = ApiResponse<CreateAIRetroData>;

// 상세 회고 데이터 타입
export interface RetrospectiveDetailData {
  id: number;
  title: string;
  projectResult: string;
  writtenDate: string;
  teamName: string;
}

// 상세 회고 응답 타입
export type GetRetrospectiveDetailResponse = ApiResponse<RetrospectiveDetailData>;

// 회고 목록 아이템 타입
export interface RetrospectiveSummary {
  retrospectiveId: number;
  title: string;
  teamName?: string;
  createdAt: string;
}

// 회고 목록 조회 응답 데이터 타입
export interface GetRetrospectivesData {
  retrospectives: RetrospectiveSummary[];
}

// 회고 목록 조회 전체 응답 타입
export type GetRetrospectivesResponse = ApiResponse<GetRetrospectivesData>;
