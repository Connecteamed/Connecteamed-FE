import type {
  CreateMinuteRequest,
  CreateMinuteResponse,
  DeleteMinuteResponse,
  GetMinuteDetailResponse,
  GetMinutesResponse,
} from '@/types/minutes';
import axios from 'axios';

const API_URL = 'https://api.connecteamed.shop';

// 목록 조회
export const getMinutes = async (projectId: number) => {
  const res = await axios.get<GetMinutesResponse>(`${API_URL}/api/projects/${projectId}/meetings`);
  return res.data;
};

// 생성
export const postMinute = async (projectId: number, payload: CreateMinuteRequest) => {
  const res = await axios.post<CreateMinuteResponse>(
    `${API_URL}/api/projects/${projectId}/meetings`,
    payload,
  );
  return res.data;
};

// 상세 조회
export const getMinuteDetail = async (meetingId: number) => {
  const res = await axios.get<GetMinuteDetailResponse>(`${API_URL}/api/meetings/${meetingId}`);
  return res.data;
};

// 삭제
export const deleteMinute = async (meetingId: number) => {
  const res = await axios.delete<DeleteMinuteResponse>(`${API_URL}/api/meetings/${meetingId}`);
  return res.data;
};
