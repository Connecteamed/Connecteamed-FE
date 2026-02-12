export interface CompletedTaskAssignee {
  id: number;
  nickname: string;
}

export interface CompletedTask {
  taskId: number;
  title: string;
  contents: string;
  status: 'DONE';
  startDate: string;
  endDate: string;
  assignees: CompletedTaskAssignee[];
  isMine: boolean;
}

export interface CompletedTasksResponse {
  status: 'success';
  data: {
    tasks: CompletedTask[];
  };
}
