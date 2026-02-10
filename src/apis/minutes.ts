import type {
  CreateMinuteRequest,
  CreateMinuteResponse,
  DeleteMinuteResponse,
  GetMinuteDetailResponse,
  GetMinutesResponse,
  UpdateMinuteRequest,
  UpdateMinuteResponse,
} from '@/types/minutes';
import { instance } from './axios';

export const getMinutes = async (projectId: number) => {
  const res = await instance.get<GetMinutesResponse>(`/projects/${projectId}/meetings`);
  return res.data;
};

export const postMinute = async (projectId: number, payload: CreateMinuteRequest) => {
  const res = await instance.post<CreateMinuteResponse>(`/projects/${projectId}/meetings`, payload);
  return res.data;
};

export const getMinuteDetail = async (meetingId: number) => {
  const res = await instance.get<GetMinuteDetailResponse>(`/meetings/${meetingId}`);
  return res.data;
};

export const patchMinute = async (meetingId: number, payload: UpdateMinuteRequest) => {
  const res = await instance.patch<UpdateMinuteResponse>(`/meetings/${meetingId}`, payload);
  return res.data;
};

export const deleteMinute = async (meetingId: number) => {
  const res = await instance.delete<DeleteMinuteResponse>(`/meetings/${meetingId}`);
  return res.data;
};
