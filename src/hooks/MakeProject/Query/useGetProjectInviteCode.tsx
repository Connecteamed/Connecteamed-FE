import { getProjectInviteCode } from '@/apis/TaskPage/project';
import { QUERY_KEY } from '@/constants/key';
import type { ResponseProjectInviteCodeDTO } from '@/types/TaskManagement/project';
import { useQuery } from '@tanstack/react-query';

function useGetProjectIniteCode(projectId: number) {
  return useQuery<ResponseProjectInviteCodeDTO>({
    queryKey: [QUERY_KEY.inviteCode, projectId],
    queryFn: async () => {
      const res = await getProjectInviteCode(projectId);
      return res.data;
    },
    staleTime: 1000 * 6 * 5,
    gcTime: 1000 * 6 * 10,
  });
}
export default useGetProjectIniteCode;
