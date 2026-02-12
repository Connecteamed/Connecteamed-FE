import axios from '@/apis/axios';
import { CompletedTasksResponse } from '@/types/TaskManagement/completedTasks';

export const getCompletedTasks = async (projectId: number): Promise<CompletedTasksResponse> => {
  const { data } = await axios.get(`/api/projects/${projectId}/tasks/completed`);
  return data;
};
