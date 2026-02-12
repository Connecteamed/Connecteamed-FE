import { useQuery } from '@tanstack/react-query';

import { getUpcomingTasks } from '../apis/dashboardApi';

export function useUpcomingTasks(username?: string) {
  return useQuery({
    queryKey: ['dashboard', 'upcomingTasks', username ?? 'me'],
    queryFn: () => getUpcomingTasks(username),
    staleTime: 30_000,
  });
}
