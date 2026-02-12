import { useQuery } from '@tanstack/react-query';
import { getCompletedTasks } from '@/apis/TaskPage/completedTasks';
import { CompletedTasksResponse } from '@/types/TaskManagement/completedTasks';

export const useCompletedTasksQuery = (projectId: number) => {
  return useQuery<CompletedTasksResponse>(['completedTasks', projectId], () => getCompletedTasks(projectId));
};
