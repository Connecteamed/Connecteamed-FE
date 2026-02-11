import type {
  CreateAIRetroRequest,
  CreateAIRetroResponse,
  GetRetrospectivesResponse,
  RetrospectiveSummary,
} from '@/types/retrospective';

import { instance } from './axios';

export const postAIRetrospective = async (
  projectId: number,
  body: CreateAIRetroRequest,
): Promise<CreateAIRetroResponse> => {
  const { data } = await instance.post(`/projects/${projectId}/retrospectives/ai`, body);
  return data;
};

export const getRetrospectives = async (projectId: number): Promise<RetrospectiveSummary[]> => {
  const { data } = await instance.get<GetRetrospectivesResponse>(
    `/projects/${projectId}/retrospectives`,
  );
  return data.data.retrospectives ?? [];
};
