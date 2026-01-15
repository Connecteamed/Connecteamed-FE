import type {
  DashboardTaskItem,
  ComingTaskItem,
  AlarmItem,
} from '@pages/DashBoard/types/dashboard';

export const retrospectItems: DashboardTaskItem[] = [
  {
    id: 'r1',
    title: '회고 제목',
    projectName: '00공모전',
    date: '12. 14',
    teamId: '1',
  },
  {
    id: 'r2',
    title: '회고 제목',
    projectName: '00공모전',
    date: '12. 14',
    teamId: '1',
  },
];

export const comingTaskItems: ComingTaskItem[] = [
  {
    id: 'c1',
    status: '시작 전',
    title: '회고 제목',
    projectName: '00공모전',
    date: '12. 14',
    teamId: '1',
  },
  {
    id: 'c2',
    status: '진행 중',
    title: '회고 제목',
    projectName: '00공모전',
    date: '12. 14',
    teamId: '1',
  },
];

export const alarmItems: AlarmItem[] = [
  {
    id: 'a1',
    message: '새로운 업무에 태그됐어요',
    projectName: '00공모전',
    teamId: '1',
  },
];

export const dateTaskItems = [
  { id: 'd1', projectName: '00공모전', date: '12.14', teamId: '1' },
  { id: 'd1', projectName: '마케팅 원론 2조', date: '12.14', teamId: '2' },
];
