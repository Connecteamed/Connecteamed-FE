import type { ResponseCompleteTasksDTO } from '@/types/TaskManagement/taskComplete';

import { instance } from '../axios';

export const getCompletedTasks = async (
  projectId: number,
): Promise<ResponseCompleteTasksDTO['tasks']> => {
  const { data } = await instance.get(`/projects/${projectId}/tasks/completed`);
  return data?.data?.tasks ?? [];
};
