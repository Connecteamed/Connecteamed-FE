import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@constants/key';
import type { ResponseProjectMemberDTO } from '@/types/TaskManagement/project';
import { getProjectMemberList } from '@/apis/TaskPage/project';

function useGetProjectMemberList(projectId?: number) {
  const enabled = Number.isFinite(projectId);

  return useQuery<ResponseProjectMemberDTO>({
    queryKey: [QUERY_KEY.projectMembers, projectId],
    queryFn: () => getProjectMemberList(projectId as number),
    enabled,
    staleTime: 1000 * 6 * 5,
    gcTime: 1000 * 6 * 10,
  });
}

export default useGetProjectMemberList;