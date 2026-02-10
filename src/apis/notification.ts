import { instance } from "./axios"

export const getNotifications = async () => {
    const { data } = await instance.get(`/api/notifications`);
    return data?.data ?? [];
}