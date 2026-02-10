import { useMutation } from '@tanstack/react-query';

import { patchTaskStatus } from '@/apis/TaskPage/task';
import { QUERY_KEY } from '@/constants/key';
import type { PatchTaskStatusRequest } from '@/types/TaskManagement/task';
import { queryClient } from '@/utils/queryClient';

interface Params {
  taskId: string | number;
  status: PatchTaskStatusRequest['status'];
}

function usePatchTaskStatus(projectId: number) {
  return useMutation({
    mutationFn: ({ taskId, status }: Params) => patchTaskStatus(taskId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.taskList, projectId] });
    },
  });
}

export default usePatchTaskStatus;
