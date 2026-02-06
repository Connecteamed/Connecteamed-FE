import { postMakeProject } from '@/apis/TaskPage/project';
import type { RequestMakeProjectDTO } from '@/types/TaskManagement/project';
import { queryClient } from '@/utils/queryClient';
import { useMutation } from '@tanstack/react-query';

function usePostMakeProject() {
  return useMutation({
    mutationFn: (payload: RequestMakeProjectDTO) => postMakeProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-list'],
      });
    },
  });
}

export default usePostMakeProject;
