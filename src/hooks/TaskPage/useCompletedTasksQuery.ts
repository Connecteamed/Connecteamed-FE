import { useQuery } from '@tanstack/react-query';
import { getCompletedTasks } from '@/apis/TaskPage/completedTasks';
import type { CompletedTasksResponse } from '@/types/TaskManagement/completedTasks';
import { QUERY_KEY } from '@/constants/key';

export const useCompletedTasksQuery = (projectId: number) => {
  return useQuery<CompletedTasksResponse>({
    queryKey: [QUERY_KEY.completedTasks, projectId],
    queryFn: () => getCompletedTasks(projectId),
  });
};
