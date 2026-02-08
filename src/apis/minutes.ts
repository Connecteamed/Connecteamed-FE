import type {
  CreateMinuteRequest,
  CreateMinuteResponse,
  DeleteMinuteResponse,
  GetMinuteDetailResponse,
  GetMinutesResponse,
  UpdateMinuteRequest,
  UpdateMinuteResponse,
} from '@/types/minutes';
import axios from 'axios';

const API_URL = 'https://api.connecteamed.shop';

const authHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMinutes = async (projectId: number) => {
  const res = await axios.get<GetMinutesResponse>(`${API_URL}/api/projects/${projectId}/meetings`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const postMinute = async (projectId: number, payload: CreateMinuteRequest) => {
  const res = await axios.post<CreateMinuteResponse>(
    `${API_URL}/api/projects/${projectId}/meetings`,
    payload,
    { headers: authHeaders() },
  );
  return res.data;
};

export const getMinuteDetail = async (meetingId: number) => {
  const res = await axios.get<GetMinuteDetailResponse>(`${API_URL}/api/meetings/${meetingId}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const patchMinute = async (meetingId: number, payload: UpdateMinuteRequest) => {
  const res = await axios.patch<UpdateMinuteResponse>(`${API_URL}/api/meetings/${meetingId}`, payload, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteMinute = async (meetingId: number) => {
  const res = await axios.delete<DeleteMinuteResponse>(`${API_URL}/api/meetings/${meetingId}`, {
    headers: authHeaders(),
  });
  return res.data;
};
