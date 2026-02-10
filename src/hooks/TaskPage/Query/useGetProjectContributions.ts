import { getProjectContributions } from '@/apis/TaskPage/contribution';
import type { TeamContribution } from '@/types/contribution';
import { useQuery } from '@tanstack/react-query';

//팀 전체 업무 통계(contribution) 조회 훅
export const useGetProjectContributions = (projectId: number) => {
  return useQuery<TeamContribution[]>({
    queryKey: ['contributions', 'entire', projectId],

    queryFn: () => getProjectContributions(projectId),

    enabled: !!projectId,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
};

export default useGetProjectContributions;
