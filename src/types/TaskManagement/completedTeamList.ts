export interface CompletedTeam {
  id: number;
  name: string;
  roles: string[];
  createdAt: string;
  closedAt: string;
}

export interface CompletedTeamListResponse {
  status: string;
  data: {
    projects: CompletedTeam[];
  };
  message: string;
  code: string | null;
}
