import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/apis/notification';
import type { NotificationResponse } from '@/types/notification';

export const useNotification = () => {
  return useQuery<NotificationResponse>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    staleTime: 1000 * 60,
  });
};
