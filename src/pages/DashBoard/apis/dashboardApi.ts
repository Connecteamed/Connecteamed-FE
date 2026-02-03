export type UpcomingTaskApi = {
  id: number;
  title: string;
  teamName: string;
  writtenDate: string;
  teamId?: number | string;
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

const BASE_URL = "https://api.connecteamed.shop";

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function getUpcomingTasks(): Promise<UpcomingTaskApi[]> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Access token not found. Please login first.");
  }

  const res = await fetch(`${BASE_URL}/api/tasks/upcoming`, {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch upcoming tasks (${res.status}): ${text}`);
  }

  const json = (await res.json()) as ApiResponse<UpcomingTaskListRes>;
  return json.data?.tasks ?? [];
}

export type DailySchedule = {
  id: number;
  title: string;
  teamName: string;
  time: string;
};

export type DailyScheduleRes = {
  date: string;
  schedules: DailySchedule[];
};

export function toUTCDateStartISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}T00:00:00Z`;
}

export async function getDailySchedules(date: Date): Promise<DailyScheduleRes> {
  const token = getAccessToken();
  if (!token) throw new Error("No accessToken in localStorage");

  const dateIso = toUTCDateStartISO(date);
  const url = `${BASE_URL}/api/schedules/daily?date=${encodeURIComponent(dateIso)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch schedules (${res.status}): ${text}`);
  }

  const json = (await res.json()) as ApiResponse<DailyScheduleRes>;
  return json.data;
}

export type RecentRetrospectiveApi = {
  id: number;
  title: string;
  teamName: string;
  writtenDate: string;
  teamId?: number | string;
};

type RecentRetrospectiveListRes = {
  retrospectives: RecentRetrospectiveApi[];
};

export async function getRecentRetrospectives(): Promise<RecentRetrospectiveApi[]> {
  const token = getAccessToken();
  if (!token) throw new Error("Access token not found. Please login first.");

  const res = await fetch(`${BASE_URL}/api/retrospectives/recent`, {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch retrospectives (${res.status}): ${text}`);
  }

  const json = (await res.json()) as ApiResponse<RecentRetrospectiveListRes>;
  return json.data?.retrospectives ?? [];
}

export type RecentNotification = {
  id: number;
  message: string;
  teamName: string;
  isRead: boolean;
  createdAt: string;
};

type RecentNotificationListRes = {
  notifications: RecentNotification[];
};

export async function getRecentNotifications(): Promise<RecentNotification[]> {
  const token = getAccessToken();
  if (!token) throw new Error("Access token not found. Please login first.");

  const res = await fetch(`${BASE_URL}/api/notifications/recent`, {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch notifications (${res.status}): ${text}`);
  }

  const json = (await res.json()) as ApiResponse<RecentNotificationListRes>;
  return json.data?.notifications ?? [];
}