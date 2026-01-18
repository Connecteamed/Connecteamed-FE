export type DashboardTaskItem = {
  id: string;
  title: string;
  projectName: string;
  date: string;
  teamId: string;
};

export type ComingTaskItem = DashboardTaskItem & {
  status: '시작 전' | '진행 중';
};

export type AlarmItem = {
  id: string;
  message: string;
  projectName: string;
  teamId: string;
};
