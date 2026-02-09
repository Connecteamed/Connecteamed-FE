import TeamContributionList from './components/TeamContributionList';
import TeamGraph from './components/TeamGraph';
import type { MemberData } from './components/TeamContributionList';
import type { TeamActivity } from './components/TeamGraph';

const DummyMembers: MemberData[] = [
  {
    id: 1,
    name: '박성준',
    role: '프론트엔드 개발자',
    contributions: [
      { date: '2024-09-01', count: 2, level: 1 },
      { date: '2024-09-02', count: 5, level: 2 },
      { date: '2024-09-03', count: 0, level: 0 },
    ],
  },
  {
    id: 2,
    name: '이민지',
    role: '백엔드 개발자',
    contributions: [
      { date: '2024-09-01', count: 3, level: 1 },
      { date: '2024-09-02', count: 7, level: 3 },
      { date: '2024-09-03', count: 1, level: 1 },
    ],
  },
  {
    id: 3,
    name: '김도현',
    role: '디자이너',
    contributions: [
      { date: '2024-09-01', count: 0, level: 0 },
      { date: '2024-09-02', count: 4, level: 2 },
      { date: '2024-09-03', count: 6, level: 3 },
    ],
  },
  {
    id: 3,
    name: '김도현',
    role: '디자이너',
    contributions: [
      { date: '2024-09-01', count: 0, level: 0 },
      { date: '2024-09-02', count: 4, level: 2 },
      { date: '2024-09-03', count: 6, level: 3 },
    ],
  },
  {
    id: 3,
    name: '김도현',
    role: '디자이너',
    contributions: [
      { date: '2024-09-01', count: 0, level: 0 },
      { date: '2024-09-02', count: 4, level: 2 },
      { date: '2024-09-03', count: 6, level: 3 },
    ],
  },
  {
    id: 3,
    name: '김도현',
    role: '디자이너',
    contributions: [
      { date: '2024-09-01', count: 0, level: 0 },
      { date: '2024-09-02', count: 4, level: 2 },
      { date: '2024-09-03', count: 6, level: 3 },
    ],
  },
  {
    id: 3,
    name: '김도현',
    role: '디자이너',
    contributions: [
      { date: '2024-09-01', count: 0, level: 0 },
      { date: '2024-09-02', count: 4, level: 2 },
      { date: '2024-09-03', count: 6, level: 3 },
    ],
  },
];

const DummyData: TeamActivity[] = [
  { date: '2026-01-25', count: 0 },
  { date: '2026-01-26', count: 3 },
  { date: '2026-01-27', count: 5 },
  { date: '2026-01-28', count: 2 },
  { date: '2026-01-29', count: 7 },
  { date: '2026-01-30', count: 4 },
  { date: '2026-01-31', count: 6 },
  { date: '2026-02-01', count: 1 },
  { date: '2026-02-02', count: 8 },
  { date: '2026-02-03', count: 2 },
  { date: '2026-02-04', count: 5 },
  { date: '2026-02-05', count: 3 },
  { date: '2026-02-06', count: 9 },
  { date: '2026-02-07', count: 4 },
];


export const TaskStastistic = () => {
  return (
    <div className="flex w-[960px] flex-col items-center justify-center rounded-lg bg-white">
      <div className="mt-[24px] mb-[36px] w-full">
        <TeamGraph data={DummyData} />
      </div>
      <TeamContributionList members={DummyMembers} />
    </div>
  );
};

export default TaskStastistic;
