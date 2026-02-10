import { useMutation } from '@tanstack/react-query';

import { deleteTask } from '@/apis/TaskPage/task';
import { QUERY_KEY } from '@/constants/key';
import { queryClient } from '@/utils/queryClient';

function useDeleteTask(projectId: number) {
  return useMutation({
    mutationFn: (taskId: string | number) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.taskList, projectId] });
    },
  });
}

export default useDeleteTask;
