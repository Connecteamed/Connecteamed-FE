import type { ApiResponse } from '@/types';
import type { MyProjectsData, RetrospectivesData } from '@/types/mypage';
import axios from 'axios';

const API_URL = 'https://api.connecteamed.shop';

const authHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

/**
 * 완료한 프로젝트 목록 조회
 */
export const getMyProjects = async () => {
  const res = await axios.get<ApiResponse<MyProjectsData>>(
    `${API_URL}/api/mypage/projects/completed`,
    {
      headers: authHeaders(),
    },
  );
  return res.data;
};

/**
 * 완료한 프로젝트 삭제
 */
export const deleteProject = async (projectId: number) => {
  const res = await axios.delete<ApiResponse<null>>(`${API_URL}/api/mypage/project/${projectId}`, {
    headers: authHeaders(),
  });
  return res.data;
};

/**
 * 나의 회고 목록 조회
 */
export const getMyRetrospectives = async () => {
  const res = await axios.get<ApiResponse<RetrospectivesData>>(
    `${API_URL}/api/mypage/retrospectives`,
    {
      headers: authHeaders(),
    },
  );
  return res.data;
};

/**
 * 회고 삭제
 */
export const deleteRetrospective = async (retrospectiveId: number) => {
  const res = await axios.delete<ApiResponse<null>>(
    `${API_URL}/api/mypage/retrospective/${retrospectiveId}`,
    {
      headers: authHeaders(),
    },
  );
  return res.data;
};
