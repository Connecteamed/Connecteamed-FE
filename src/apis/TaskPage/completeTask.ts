
import type { CompletedTasksResponse } from '@/types/TaskManagement/completedTasks';
import { instance } from '../axios';

export const getCompletedTasks = async (
  projectId: number,
): Promise<CompletedTasksResponse> => {
  const { data } = await instance.get(`/projects/${projectId}/tasks/completed`);
  return data as CompletedTasksResponse;
};
