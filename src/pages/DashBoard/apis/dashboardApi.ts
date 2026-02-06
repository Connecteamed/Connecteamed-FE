import axios, { AxiosError } from 'axios';

export type UpcomingTaskApi = {
  id: number;
  title: string;
  teamName: string;
  writtenDate: string;
  teamId?: number | string;
};

export type RecentRetrospectiveApi = {
  id: number;
  title: string;
  teamName: string;
  writtenDate: string;
  teamId?: number | string;
};

export type RecentNotification = {
  id: number;
  message: string;
  teamName: string;
  isRead: boolean;
  createdAt: string;
};

type ApiResponse<T> = {
  status: string;
  data: T;
  message: string;
  code: string | null;
};

type UpcomingTaskListRes = {
  tasks: UpcomingTaskApi[];
};

type RecentRetrospectiveListRes = {
  retrospectives: RecentRetrospectiveApi[];
};

type RecentNotificationListRes = {
  notifications: RecentNotification[];
};

const BASE_URL = 'https://api.connecteamed.shop';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

const dashboardClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: '*/*',
  },
});

dashboardClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (!token) {
    // 토큰 없으면 여기서 막아 일관된 에러 처리
    throw new Error('Access token not found. Please login first.');
  }

  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function toErrorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) return err.message;

  const ax = err as AxiosError<any>;
  const serverMsg =
    ax?.response?.data?.message || ax?.response?.data?.error || ax?.response?.data?.msg;

  if (typeof serverMsg === 'string' && serverMsg.trim().length > 0) return serverMsg;
  if (typeof ax?.message === 'string' && ax.message.trim().length > 0) return ax.message;

  return fallback;
}

export async function getUpcomingTasks(): Promise<UpcomingTaskApi[]> {
  try {
    const res = await dashboardClient.get<ApiResponse<UpcomingTaskListRes>>('/api/tasks/upcoming');
    return res.data?.data?.tasks ?? [];
  } catch (err) {
    throw new Error(toErrorMessage(err, 'Failed to fetch upcoming tasks.'));
  }
}

export async function getRecentRetrospectives(): Promise<RecentRetrospectiveApi[]> {
  try {
    const res = await dashboardClient.get<ApiResponse<RecentRetrospectiveListRes>>(
      '/api/retrospectives/recent',
    );
    return res.data?.data?.retrospectives ?? [];
  } catch (err) {
    throw new Error(toErrorMessage(err, 'Failed to fetch retrospectives.'));
  }
}

export async function getRecentNotifications(): Promise<RecentNotification[]> {
  try {
    const res = await dashboardClient.get<ApiResponse<RecentNotificationListRes>>(
      '/api/notifications/recent',
    );
    return res.data?.data?.notifications ?? [];
  } catch (err) {
    throw new Error(toErrorMessage(err, 'Failed to fetch notifications.'));
  }
}
