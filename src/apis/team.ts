import type { ApiResponse } from '@/types';
import { instance } from './axios';

interface MyTeamsData {
  teams: Array<{
    teamId: number;
    name: string;
  }>;
}

export const getMyTeams = async () => {
  const res = await instance.get<ApiResponse<MyTeamsData>>('/teams/my');
  return res.data;
};
