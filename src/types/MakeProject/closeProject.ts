export interface CloseProjectResponse {
  status: 'success';
  data: {
    projectId: number;
    status: 'COMPLETED';
    closedAt: string;
  };
}
