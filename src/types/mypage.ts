import type { ApiResponse } from './api';

export interface Project {
  id: number;
  name: string;
  roles: string[];
  createdAt: string;
  closedAt: string;
}

export interface MyProjectsData {
  projects: Project[];
}

export interface Retrospective {
  id: number;
  title: string;
  createdAt: string;
  projectId?: number | string;
  teamId?: number | string;
}

export interface RetrospectivesData {
  retrospectives: Retrospective[];
}

export type MyProjectsResponse = ApiResponse<MyProjectsData>;
export type MyRetrospectivesResponse = ApiResponse<RetrospectivesData>;
