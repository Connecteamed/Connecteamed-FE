export interface Notification {
  id: number;
  notificationType: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  targetUrl: string;
}

export interface NotificationResponse {
  unreadCount: number;
  notifications: Notification[];
}
