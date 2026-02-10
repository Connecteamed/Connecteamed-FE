import { useQuery } from '@tanstack/react-query';

import { getCompletedTasks } from '@/apis/TaskPage/completeTask';
import { QUERY_KEY } from '@/constants/key';
import type { CompleteTask } from '@/types/TaskManagement/taskComplete';

function useGetCompletedTasks(projectId: number) {
  return useQuery<CompleteTask[]>({
    queryKey: [QUERY_KEY.completeTaskList, projectId],
    queryFn: () => getCompletedTasks(projectId),
    enabled: Number.isFinite(projectId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetCompletedTasks;
