import Card from '@/pages/DashBoard/components/Card/Card';
import { useRecentNotifications } from '../../hooks/useRecentNotifications';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}
function formatMMDD(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
}

export default function AlarmCard() {
  const { data = [], isLoading, isError } = useRecentNotifications();

  return (
    <Card title="알림">
      {isLoading && <div className="text-sm text-neutral-500">불러오는 중...</div>}
      {isError && <div className="text-sm text-red-500">알림을 불러오지 못했어요.</div>}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-3">
          {data.length === 0 && (
            <div className="text-sm text-neutral-500">알림이 없어요.</div>
          )}

          {data.map((n) => (
            <div key={n.id} className="flex items-center justify-between">
              <div className="flex items-center min-w-0 gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0" />
                <div className="text-sm truncate text-neutral-700">{n.message}</div>
              </div>

              <div className="flex items-center gap-4 text-sm shrink-0 text-neutral-500">
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
