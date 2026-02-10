export type CompleteTaskStatusApi = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';
export type CompleteTaskStatusLabel = '시작 전' | '진행 중' | '완료';

export interface CompleteAssignee {
  id: number;
  nickname: string;
}

export interface CompleteTask {
  taskId: number;
  title: string;
  contents: string;
  status: CompleteTaskStatusApi;
  startDate: string;
  endDate: string;
  assignees: CompleteAssignee[];
  isMine: boolean;
}

export interface ResponseCompleteTasksDTO {
  tasks: CompleteTask[];
}
