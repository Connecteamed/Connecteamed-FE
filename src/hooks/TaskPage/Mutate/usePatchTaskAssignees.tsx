import { useMutation } from '@tanstack/react-query';

import { patchTaskAssignees } from '@/apis/TaskPage/task';
import { QUERY_KEY } from '@/constants/key';
import type { PatchTaskAssigneesRequest } from '@/types/TaskManagement/task';
import { queryClient } from '@/utils/queryClient';

interface Params extends PatchTaskAssigneesRequest {
  taskId: string | number;
}

function usePatchTaskAssignees(projectId: number) {
  return useMutation({
    mutationFn: ({ taskId, assigneeProjectMemberIds }: Params) =>
      patchTaskAssignees(taskId, { assigneeProjectMemberIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.taskList, projectId] });
    },
  });
}

export default usePatchTaskAssignees;
