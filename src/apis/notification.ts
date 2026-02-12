import { instance } from "./axios"

export const getNotifications = async () => {
    const { data } = await instance.get(`/notifications`);
    if (data?.data && typeof data.data.unreadCount === 'number' && Array.isArray(data.data.notifications)) {
        return data.data;
    }
    return { unreadCount: 0, notifications: [] };
}