import type { CompletedTasksResponse } from '@/types/TaskManagement/completedTasks';
import { instance } from '../axios';

export const getCompletedTasks = async (projectId: number): Promise<CompletedTasksResponse> => {
  const { data } = await instance.get(`/api/projects/${projectId}/tasks/completed`);
  return data;
};
