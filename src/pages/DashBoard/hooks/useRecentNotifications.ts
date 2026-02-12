import { useQuery } from '@tanstack/react-query';

import { type DashboardNotification, getRecentNotifications } from '../apis/dashboardApi';

export function useRecentNotifications() {
  return useQuery<DashboardNotification[], Error>({
    queryKey: ['dashboard', 'recentNotifications'],
    queryFn: () => getRecentNotifications(),
    staleTime: 30_000,
  });
}
