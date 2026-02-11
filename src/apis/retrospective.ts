import type {
  CreateAIRetroRequest,
  CreateAIRetroResponse,
  GetRetrospectiveDetailResponse,
  GetRetrospectivesResponse,
  RetrospectiveDetailData,
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

export const getRetrospectiveById = async (
  projectId: number,
  retrospectiveId: number,
): Promise<RetrospectiveDetailData> => {
  const { data } = await instance.get<GetRetrospectiveDetailResponse>(
    `/projects/${projectId}/retrospectives/${retrospectiveId}`,
  );
  return data.data;
};

export const getRetrospectives = async (projectId: number): Promise<RetrospectiveSummary[]> => {
  const { data } = await instance.get<GetRetrospectivesResponse>(
    `/projects/${projectId}/retrospectives`,
  );
  return data.data.retrospectives ?? [];
};
