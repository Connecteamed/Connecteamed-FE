import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { getRetrospectiveById } from '@/apis/retrospective';
import { QUERY_KEY } from '@/constants/key';
import type { RetrospectiveDetailData } from '@/types/retrospective';

export const useGetRetrospectiveDetail = (
  projectId: number,
  retrospectiveId: number | null,
  enabled: boolean,
  options?: Omit<UseQueryOptions<RetrospectiveDetailData>, 'queryKey' | 'queryFn' | 'enabled'>,
) => {
  return useQuery<RetrospectiveDetailData>({
    queryKey: [QUERY_KEY.retrospectiveDetail, projectId, retrospectiveId],
    queryFn: () => getRetrospectiveById(projectId, retrospectiveId as number),
    enabled: enabled && retrospectiveId !== null,
    ...options,
  });
};
