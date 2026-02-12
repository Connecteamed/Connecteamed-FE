import { instance } from './axios';

export const getNotifications = async () => {
  const { data } = await instance.get(`/notifications`);

  if (data && typeof data.unreadCount === 'number' && Array.isArray(data.notifications)) {
    return data; // data.data가 아니라 data를 그대로 리턴
  }

  return { unreadCount: 0, notifications: [] };
};
