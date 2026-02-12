import { useQuery } from '@tanstack/react-query';
import { getCompletedTeamList } from '@/apis/TaskPage/completedTeamList';

export default function useGetCompletedTeamList() {
  return useQuery({
    queryKey: ['completedTeamList'],
    queryFn: getCompletedTeamList,
  });
}
