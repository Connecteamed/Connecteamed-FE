import type { ApiResponse } from './api';


interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}


export interface MemberContributionData {
  id: number;
  name: string;
  contributions: Contribution[];
}

export interface TeamContribution {
  date: string;
  count: number;
}



export type TeamMemberContributionResponse = ApiResponse<MemberContributionData[]>;
export type TeamContributionResponse = ApiResponse<TeamContribution[]>;