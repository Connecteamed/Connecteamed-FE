import { getProjectRoleList } from "@/apis/TaskPage/project";
import { QUERY_KEY } from "@constants/key";
import type { ProjectRole } from "@/types/TaskManagement/project";
import { useQuery } from "@tanstack/react-query";

function useGetProjectRoleList(projectId?: number) {
  const enabled = Number.isFinite(projectId);

  return useQuery<ProjectRole[]>({
    queryKey: [QUERY_KEY.roleList, projectId],
    queryFn: async() => {
        const res = await getProjectRoleList(projectId as number);
        return res.data?.roles ?? [];
    },
    enabled,
    staleTime: 1000 * 6 * 5,
    gcTime: 1000 * 6 * 10,
  });
}

export default useGetProjectRoleList;