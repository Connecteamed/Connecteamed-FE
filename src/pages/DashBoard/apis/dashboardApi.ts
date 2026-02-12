import axios from 'axios';

export type ApiResponse<T> = {
  status: string;
  data: T;
  message?: string;
  code?: string | null;
};

type JwtPayload = {
  username?: string;
  userName?: string;
  name?: string;
  memberName?: string;
  nickname?: string;
  [k: string]: unknown;
};

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function getUsernameFromToken(): string | undefined {
  const token = localStorage.getItem('accessToken');
  if (!token) return undefined;

  const payload = parseJwtPayload(token);
  if (!payload) return undefined;

  return (
    payload.username ??
    payload.userName ??
    payload.name ??
    payload.memberName ??
    payload.nickname ??
    undefined
  );
}

export const dashboardClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: false,
});

dashboardClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

// GET /api/tasks/upcoming
export type UpcomingTaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type UpcomingTaskApi = {
  id: number;
  title: string;
  status: UpcomingTaskStatus;
  teamName: string;
  endDate: string;
  teamId?: number | string; // 백엔드에서 추가되면 자동 대응
};

type UpcomingTasksResponse = {
  tasks?: UpcomingTaskApi[];
};

export async function getUpcomingTasks(username?: string): Promise<UpcomingTaskApi[]> {
  const u = username ?? getUsernameFromToken();

  const { data } = await dashboardClient.get<ApiResponse<UpcomingTasksResponse>>(
    '/api/tasks/upcoming',
    { params: u ? { username: u } : undefined },
  );

  const tasks = data.data.tasks;
  return Array.isArray(tasks) ? tasks : [];
}

// GET /api/notifications/recent
export type DashboardNotification = {
  id: number;
  message: string;
  teamName: string;
  isRead: boolean;
  createdAt: string;
  notificationType?: string;
  targetUrl?: string; // 백엔드가 이동용으로 내려주는 값
};

type RecentNotificationsResponse = {
  unreadCount?: number;
  notifications: DashboardNotification[];
};

export async function getRecentNotifications(username?: string): Promise<DashboardNotification[]> {
  const u = username ?? getUsernameFromToken();

  const { data } = await dashboardClient.get<ApiResponse<RecentNotificationsResponse>>(
    '/api/notifications/recent',
    { params: u ? { username: u } : undefined },
  );

  return Array.isArray(data.data.notifications) ? data.data.notifications : [];
}

// GET /api/retrospectives/recent
export type DashboardRetrospective = {
  id: number;
  title: string;
  teamName: string;
  writtenDate: string;
  teamId?: number | string;
};

type RecentRetrospectivesRes = {
  retrospectives?: unknown[];
};

export async function getRecentRetrospectives(): Promise<DashboardRetrospective[]> {
  try {
    const { data } = await dashboardClient.get<ApiResponse<RecentRetrospectivesRes>>(
      '/api/retrospectives/recent',
    );

    const raw = data.data.retrospectives;
    if (!Array.isArray(raw)) return [];

    return raw
      .filter(isRecord)
      .map((r) => ({
        id: asNumber(r.id, 0),
        title: asString(r.title, ''),
        teamName: asString(r.teamName, ''),
        writtenDate: asString(r.writtenDate ?? r.createdAt, ''),
        teamId: (r.teamId as number | string | undefined) ?? undefined,
      }))
      .filter((r) => r.id !== 0);
  } catch {
    return [];
  }
}

// GET /api/contributions/calendar
export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type ContributionCalendar = {
  year: number;
  totalActivityCount: number;
  userId: number | null;
  contributions: ContributionDay[];
};

export async function getContributionCalendar(year: number): Promise<ContributionCalendar> {
  const { data } = await dashboardClient.get<ApiResponse<ContributionCalendar>>(
    '/api/contributions/calendar',
    { params: { year } },
  );
  return data.data;
}
