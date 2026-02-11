import { useQuery } from '@tanstack/react-query';

import { getRetrospectives } from '@/apis/retrospective';
import { QUERY_KEY } from '@/constants/key';
import type { RetrospectiveSummary } from '@/types/retrospective';

export const useGetRetrospectives = (projectId: number) => {
  return useQuery<RetrospectiveSummary[]>({
    queryKey: [QUERY_KEY.retrospectiveList, projectId],
    queryFn: () => getRetrospectives(projectId),
    enabled: !!projectId,
  });
};
