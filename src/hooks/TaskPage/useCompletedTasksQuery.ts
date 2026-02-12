import { useQuery } from '@tanstack/react-query';
import type { CompletedTasksResponse } from '@/types/TaskManagement/completedTasks';
import { QUERY_KEY } from '@/constants/key';
import { getCompletedTasks } from '@/apis/TaskPage/completeTask';

export const useCompletedTasksQuery = (projectId: number) => {
  return useQuery<CompletedTasksResponse>({
    queryKey: [QUERY_KEY.completedTasks, projectId],
    queryFn: () => getCompletedTasks(projectId),
  });
};
