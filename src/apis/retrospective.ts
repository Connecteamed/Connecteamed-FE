import type {
  CreateAIRetroRequest,
  CreateAIRetroResponse,
  GetRetrospectiveDetailResponse,
  GetRetrospectivesResponse,
  RetrospectiveDetailData,
  RetrospectiveSummary,
  UpdateRetrospectiveRequest,
  UpdateRetrospectiveResponse,
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

export const patchRetrospective = async (
  projectId: number,
  retrospectiveId: number,
  body: UpdateRetrospectiveRequest,
): Promise<UpdateRetrospectiveResponse> => {
  const { data } = await instance.patch(
    `/projects/${projectId}/retrospectives/${retrospectiveId}`,
    body,
  );
  return data;
};

export const deleteRetrospective = async (
  projectId: number,
  retrospectiveId: number,
): Promise<void> => {
  await instance.delete(`/projects/${projectId}/retrospectives/${retrospectiveId}`);
};
