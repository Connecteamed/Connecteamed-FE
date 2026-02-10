import Card from '@/pages/DashBoard/components/Card/Card';
import type { DashboardCardNavProps } from '@/pages/DashBoard/types/types';

import type { UpcomingTaskApi } from '../../apis/dashboardApi';
import { useUpcomingTasks } from '../../hooks/useUpcomingTasks';
import { calcTaskStatus, formatMMDD } from '../../utils/date';

export default function ComingtaskCard({ onGoToTeam }: DashboardCardNavProps) {
  const { data = [], isLoading, isError } = useUpcomingTasks();

  if (isLoading) {
    return (
      <Card title="다가오는 업무">
        <div className="text-sm text-neutral-500">불러오는 중...</div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card title="다가오는 업무">
        <div className="text-sm text-red-500">업무를 불러오지 못했어요.</div>
      </Card>
    );
  }

  return (
    <Card title="다가오는 업무">
      <div className="flex flex-col gap-4">
        {data.map((item: UpcomingTaskApi) => {
          const status = calcTaskStatus(item.writtenDate);
          const date = formatMMDD(item.writtenDate);

          return (
            <div key={item.id} className="flex items-center gap-4">
              <div
                className={`flex h-7 w-20 items-center justify-center rounded-[20px] ${
                  status === '시작 전' ? 'bg-zinc-200' : 'bg-orange-100'
                }`}
              >
                <span className="text-xs font-medium">{status}</span>
              </div>

              <div className="flex flex-1 justify-between">
                <button
                  onClick={() => {
                    if (item.teamId !== undefined && item.teamId !== null) {
                      onGoToTeam(String(item.teamId));
                    }
                  }}
                  className="text-sm hover:underline"
                  type="button"
                >
                  {item.title}
                </button>

                <div className="flex gap-5 text-sm text-neutral-500">
                  <span>{item.teamName}</span>
                  <span>{date}</span>
                </div>
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-sm text-neutral-500">다가오는 업무가 없어요.</div>
        )}
      </div>
    </Card>
  );
}
