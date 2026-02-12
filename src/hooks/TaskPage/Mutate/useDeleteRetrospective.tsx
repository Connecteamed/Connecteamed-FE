import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRetrospective } from '@/apis/retrospective';
import { QUERY_KEY } from '@/constants/key';

interface UseDeleteRetrospectiveParams {
  projectId: number;
}

export const useDeleteRetrospective = ({ projectId }: UseDeleteRetrospectiveParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (retrospectiveId: number) => deleteRetrospective(projectId, retrospectiveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.retrospectiveList, projectId] });
    },
  });
};
