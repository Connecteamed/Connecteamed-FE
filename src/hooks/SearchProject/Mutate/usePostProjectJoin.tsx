import { postProjectJoin } from '@/apis/TaskPage/project';
import { QUERY_KEY } from '@/constants/key';
import { queryClient } from '@/utils/queryClient';
import { useMutation } from '@tanstack/react-query';

function usePostProjectJoin(invitecode: string) {
  return useMutation({
    mutationFn: async () => {
      const res = await postProjectJoin(invitecode);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-list'] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.teams] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myCompletedProjects] });
    },
  });
}

export default usePostProjectJoin;
