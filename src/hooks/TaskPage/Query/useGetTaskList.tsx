import { getTaskList } from '@/apis/TaskPage/task';
import { QUERY_KEY } from '@/constants/key';
import type { Task } from '@/types/TaskManagement/task';
import { useQuery } from '@tanstack/react-query';

function useGetTaskList(projectId: number) {
  return useQuery<Task[]>({
    queryKey: [QUERY_KEY.taskList, projectId] as const,
    queryFn: () => getTaskList(projectId),
    staleTime: 1000 * 6 * 5,
    gcTime: 1000 * 6 * 10,
  });
}

export default useGetTaskList;
