import { instance } from '@/apis/axios';
import type { CloseProjectResponse } from '@/types/MakeProject/closeProject';

export const closeProject = async (projectId: number): Promise<CloseProjectResponse> => {
  const { data } = await instance.patch(`/projects/${projectId}/close`);
  return data;
};
