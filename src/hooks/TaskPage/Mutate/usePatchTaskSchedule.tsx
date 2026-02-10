import { useMutation } from '@tanstack/react-query';

import { patchTaskSchedule } from '@/apis/TaskPage/task';
import { QUERY_KEY } from '@/constants/key';
import type { PatchTaskScheduleRequest } from '@/types/TaskManagement/task';
import { queryClient } from '@/utils/queryClient';

interface Params extends PatchTaskScheduleRequest {
  taskId: string | number;
}

function usePatchTaskSchedule(projectId: number) {
  return useMutation({
    mutationFn: ({ taskId, startDate, dueDate }: Params) =>
      patchTaskSchedule(taskId, { startDate, dueDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.taskList, projectId] });
    },
  });
}

export default usePatchTaskSchedule;
