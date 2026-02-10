export type TaskStatusApi = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';
export type TaskStatusLabel = '시작 전' | '진행 중' | '완료';

export interface Task {
  taskId: string;
  name: string;
  content: string;
  status: TaskStatusApi;
  startDate: string;
  dueDate: string;
  assignees: Assignee[];
}

export interface Assignee {
  projectMemberId: number;
  memberId: number;
  memberPublicId: string;
  memberName: string;
}

export interface PostTask {
  name: string;
  content: string;
  startDate: string;
  dueDate: string;
  assigneeProjectMemberIds: number[];
}

export interface PatchTaskStatusRequest {
  status: TaskStatusApi;
}

export interface PatchTaskScheduleRequest {
  startDate?: string;
  dueDate?: string;
}

export interface PatchTaskAssigneesRequest {
  assigneeProjectMemberIds: number[];
}

export type ResponseTaskDTO = Task[];
export type RequestPostTaskDTO = PostTask;