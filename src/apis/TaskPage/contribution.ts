import type {
  MemberContributionData,
  TeamContribution,
  TeamContributionResponse,
  TeamMemberContributionResponse,
} from '@/types/contribution';

import { instance } from '../axios';

//프로젝트 팀원별 업무 통계(잔디) 조회 API
export const getMemberContributions = async (
  projectId: number,
): Promise<MemberContributionData[]> => {
  const response = await instance.get<TeamMemberContributionResponse>(
    `/contributions/${projectId}/individual`,
  );

  return response.data.data;
};

//프로젝트 팀 전체 업무 통계 조회 API
export const getProjectContributions = async (projectId: number): Promise<TeamContribution[]> => {
  const response = await instance.get<TeamContributionResponse>(
    `/contributions/${projectId}/entire`,
  );

  return response.data.data;
};
