import { useMutation } from '@tanstack/react-query';

import { patchTask } from '@/apis/TaskPage/task';
import { QUERY_KEY } from '@/constants/key';
import type { RequestPostTaskDTO } from '@/types/TaskManagement/task';
import { queryClient } from '@/utils/queryClient';

function usePatchTask(projectId: number, taskId: number) {
  return useMutation({
    mutationFn: (payload: RequestPostTaskDTO) => patchTask(projectId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.taskList, projectId] });
    },
  });
}

export default usePatchTask;
