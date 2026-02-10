import type { ApiResponse } from '@/types';
import type { MyProjectsData, RetrospectivesData } from '@/types/mypage';
import { instance } from './axios';

/**
 * 완료한 프로젝트 목록 조회
 */
export const getMyProjects = async () => {
  const res = await instance.get<ApiResponse<MyProjectsData>>('/mypage/projects/completed');
  return res.data;
};

/**
 * 완료한 프로젝트 삭제
 */
export const deleteProject = async (projectId: number) => {
  const res = await instance.delete<ApiResponse<null>>(`/mypage/projects/${projectId}`);
  return res.data;
};

/**
 * 나의 회고 목록 조회
 */
export const getMyRetrospectives = async () => {
  const res = await instance.get<ApiResponse<RetrospectivesData>>('/mypage/retrospectives');
  return res.data;
};

/**
 * 회고 삭제
 */
export const deleteRetrospective = async (retrospectiveId: number) => {
  const res = await instance.delete<ApiResponse<null>>(`/mypage/retrospectives/${retrospectiveId}`);
  return res.data;
};
