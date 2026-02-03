import Card from '@/pages/DashBoard/components/Card/Card';
import type { DashboardCardNavProps } from '@/pages/DashBoard/types/types';
import { useRecentRetrospectives } from '../../hooks/useRecentRetrospectives';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatMMDD(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
}

export default function RetrospectCard({ onGoToTeam }: DashboardCardNavProps) {
  const { data = [], isLoading, isError } = useRecentRetrospectives();

  return (
    <Card title="회고 목록">
      {isLoading && <div className="text-sm text-neutral-500">불러오는 중...</div>}
      {isError && <div className="text-sm text-red-500">회고를 불러오지 못했어요.</div>}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-4">
          {data.length === 0 && (
            <div className="text-sm text-neutral-500">회고가 없어요.</div>
          )}

          {data.map((item, idx) => (
            <div key={item.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    // teamId가 응답에 있으면 이동, 없으면 무시
                    if (item.teamId !== undefined && item.teamId !== null) {
                      onGoToTeam(item.teamId);
                    }
                  }}
                  className="text-neutral-500 text-sm font-medium font-['Inter'] hover:underline focus:outline-none"
                >
                  {item.title}
                </button>

                <div className="flex items-center gap-5">
                  <div className="text-neutral-500 text-sm font-medium font-['Inter']">
                    {item.teamName}
                  </div>
                  <div className="text-neutral-500 text-sm font-medium font-['Inter']">
                    {formatMMDD(item.writtenDate)}
                  </div>
                </div>
              </div>

              {idx !== data.length - 1 && (
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-300" />
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
