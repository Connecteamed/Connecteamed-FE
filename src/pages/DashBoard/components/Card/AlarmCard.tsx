import Card from '@/pages/DashBoard/components/Card/Card';

import { useRecentNotifications } from '../../hooks/useRecentNotifications';
import { formatMMDD } from '../../utils/date';

export default function AlarmCard() {
  const { data = [], isLoading, isError } = useRecentNotifications();

  return (
    <Card title="알림">
      {isLoading && <div className="text-sm text-neutral-500">불러오는 중...</div>}
      {isError && <div className="text-sm text-red-500">알림을 불러오지 못했어요.</div>}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-3">
          {data.length === 0 && <div className="text-sm text-neutral-500">알림이 없어요.</div>}

          {data.map((n) => (
            <div key={n.id} className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                <div className="truncate text-sm text-neutral-700">{n.message}</div>
              </div>

              <div className="flex shrink-0 items-center gap-4 text-sm text-neutral-500">
                <span>{n.teamName}</span>
                <span>{formatMMDD(n.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
