import { useMutation } from '@tanstack/react-query';
import { patchTaskDetail, type PatchTaskDetailParams } from '@/apis/TaskPage/patchTaskDetail';

export default function usePatchTaskDetail(taskId: number) {
  return useMutation({
    mutationFn: (params: PatchTaskDetailParams) => patchTaskDetail(taskId, params),
  });
}
