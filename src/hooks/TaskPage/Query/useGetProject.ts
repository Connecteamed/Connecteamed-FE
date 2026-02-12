import { useQuery } from '@tanstack/react-query';
import { getProject } from '@/apis/TaskPage/project';

export const useGetProject = (projectId: number) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
  });
};

export default useGetProject;
