import { useNavigate } from 'react-router-dom';

import Card from '@/pages/DashBoard/components/Card/Card';

import type { UpcomingTaskApi } from '../../apis/dashboardApi';
import { useUpcomingTasks } from '../../hooks/useUpcomingTasks';
import { formatMMDD } from '../../utils/date';

const DAY = 1000 * 60 * 60 * 24;

function daysLeft(endDate: string) {
  const t = new Date(endDate).getTime();
  if (Number.isNaN(t)) return null;
  return Math.ceil((t - Date.now()) / DAY);
}

export default function ComingtaskCard() {
  const { data = [], isLoading, isError } = useUpcomingTasks();
  const navigate = useNavigate();

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

  const filtered = data
    .filter((t) => {
      const left = daysLeft(t.endDate);
      return left !== null && left >= 0 && left <= 7;
    })
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  return (
    <Card title="다가오는 업무">
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-4">
            {filtered.map((item: UpcomingTaskApi) => {
              const statusLabel = item.status === 'IN_PROGRESS' ? '진행 중' : '시작 전'; // TODO면 시작 전

              const statusClass =
                item.status === 'IN_PROGRESS'
                  ? 'bg-orange-100 text-neutral-600'
                  : 'bg-zinc-200 text-neutral-600';

              const date = formatMMDD(item.endDate);

              return (
                <div key={item.id} className="flex items-center gap-4">
                  <div
                    className={`flex h-7 w-20 items-center justify-center rounded-[20px] ${statusClass}`}
                  >
                    <span className="text-xs font-medium">{statusLabel}</span>
                  </div>

                  <div className="flex flex-1 justify-between">
                    <button
                      type="button"
                      className="min-w-0 truncate text-left text-sm hover:underline"
                      onClick={() => {
                        const teamId = item.teamId;
                        if (!teamId) {
                          alert('teamId가 없어서 업무 상세로 이동할 수 없어요.');
                          return;
                        }
                        navigate(`/team/${teamId}`);
                      }}
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

            {filtered.length === 0 && (
              <div className="text-sm text-neutral-500">다가오는 업무가 없어요.</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
