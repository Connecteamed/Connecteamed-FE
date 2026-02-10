import { patchMemberRole } from '@/apis/TaskPage/project';
import { QUERY_KEY } from '@/constants/key';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectMember } from '@/types/TaskManagement/project';


const usePatchMemberRoles = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, roleIds }: { memberId: number; roleIds: number[] }) =>
      patchMemberRole(projectId, memberId, roleIds),

    onMutate: async ({ memberId, roleIds }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.projectMembers, projectId] });

      const previousMembers = queryClient.getQueryData<ProjectMember[]>([
        QUERY_KEY.projectMembers,
        projectId,
      ]);

      // Optimistic update: UI 즉시 반영
      queryClient.setQueryData<ProjectMember[]>([QUERY_KEY.projectMembers, projectId], (old) =>
        old?.map((m) =>
          m.projectMemberId === memberId
            ? { ...m, roles: roleIds.map((id) => `role-${id}`) } // UI용 string[]
            : m
        )
      );

      return { previousMembers };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData([QUERY_KEY.projectMembers, projectId], context.previousMembers);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.projectMembers, projectId] });
    },
  });
};

export default usePatchMemberRoles;
export { usePatchMemberRoles };
