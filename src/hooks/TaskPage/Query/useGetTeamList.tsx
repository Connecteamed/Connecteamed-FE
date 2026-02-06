import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@constants/key'
import type { ResponseTeamListDTO } from '@/types/TaskManagement/team';
import { getTeamList } from '@/apis/TaskPage/GetTeamList';

function useGetTeamList() {
  return useQuery<ResponseTeamListDTO>({
    queryKey: [QUERY_KEY.teams],
    queryFn: () => getTeamList(),
    staleTime: 1000 * 6 * 5,
    gcTime: 1000 * 6 * 10,
  });
}

export default useGetTeamList;
