import { getMemberContributions } from '@/apis/TaskPage/contribution';
import type { MemberContributionData } from '@/types/contribution';
import { useQuery } from '@tanstack/react-query';

//프로젝트 팀원별 잔디 데이터 조회 훅
export const useGetProjectMemberContributions = (projectId: number) => {
  return useQuery<MemberContributionData[]>({
    queryKey: ['contributions', 'individual', projectId],

    queryFn: () => getMemberContributions(projectId),

    enabled: !!projectId,

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
};

export default useGetProjectMemberContributions;
