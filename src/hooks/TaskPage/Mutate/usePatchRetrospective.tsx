import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchRetrospective } from '@/apis/retrospective';
import { QUERY_KEY } from '@/constants/key';
import type { UpdateRetrospectiveRequest } from '@/types/retrospective';

interface UsePatchRetrospectiveParams {
  projectId: number;
}

export const usePatchRetrospective = ({ projectId }: UsePatchRetrospectiveParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      retrospectiveId,
      body,
    }: {
      retrospectiveId: number;
      body: UpdateRetrospectiveRequest;
    }) => patchRetrospective(projectId, retrospectiveId, body),
    onSuccess: (_, { retrospectiveId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.retrospectiveList, projectId] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.retrospectiveDetail, projectId, retrospectiveId],
      });
    },
  });
};
