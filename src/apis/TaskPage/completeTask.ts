import { instance } from '../axios';
import type { ResponseCompleteTasksDTO } from '@/types/TaskManagement/taskComplete';

export const getCompletedTasks = async (projectId: number): Promise<ResponseCompleteTasksDTO['tasks']> => {
  const { data } = await instance.get(`/projects/${projectId}/tasks/complete`);
  return data?.data?.tasks ?? [];
};
