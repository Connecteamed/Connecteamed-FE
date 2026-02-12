import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postAIRetrospective } from '@/apis/retrospective';
import { QUERY_KEY } from '@/constants/key';
import type { CreateAIRetroRequest } from '@/types/retrospective';

interface UsePostAIRetrospectiveParams {
  projectId: number;
}

export const usePostAIRetrospective = ({ projectId }: UsePostAIRetrospectiveParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateAIRetroRequest) => postAIRetrospective(projectId, body),
    onSuccess: () => {
      // 회고 생성 성공 시, 회고 목록 쿼리를 무효화하여 다시 불러오도록 합니다.
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.retrospectiveList, projectId] });
    },
    onError: (error) => {
      console.error('AI 회고 생성에 실패했습니다.', error);
    },
  });
};
