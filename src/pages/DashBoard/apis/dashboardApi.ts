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