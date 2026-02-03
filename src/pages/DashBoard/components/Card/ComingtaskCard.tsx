import Card from '@/pages/DashBoard/components/Card/Card';
import type { DashboardCardNavProps } from '@/pages/DashBoard/types/types';
import { useUpcomingTasks } from '../../hooks/useUpcomingTasks';
import type { UpcomingTaskApi } from '../../apis/dashboardApi';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatMMDD(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
}

function calcStatus(writtenDate: string): '시작 전' | '진행 중' {
  const d = new Date(writtenDate);
  if (Number.isNaN(d.getTime())) return '진행 중';
  return d.getTime() > Date.now() ? '시작 전' : '진행 중';
}

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
          const status = calcStatus(item.writtenDate);
          const date = formatMMDD(item.writtenDate);

          return (
            <div key={item.id} className="flex items-center gap-4">
              <div
                className={`w-20 h-7 rounded-[20px] flex items-center justify-center ${
                  status === '시작 전' ? 'bg-zinc-200' : 'bg-orange-100'
                }`}
              >
                <span className="text-xs font-medium">{status}</span>
              </div>

              <div className="flex justify-between flex-1">
                <button
                  onClick={() => {
                    if (item.teamId !== undefined && item.teamId !== null) {
                      onGoToTeam(item.teamId);
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
