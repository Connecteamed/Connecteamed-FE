import Card from '@/pages/DashBoard/components/Card/Card';

import { useRecentRetrospectives } from '../../hooks/useRecentRetrospectives';
import { formatMMDD } from '../../utils/date';

export default function RetrospectCard() {
  const { data = [], isLoading, isError } = useRecentRetrospectives();

  return (
    <Card title="회고 목록">
      {isLoading && <div className="text-sm text-neutral-500">불러오는 중...</div>}
      {isError && <div className="text-sm text-red-500">회고를 불러오지 못했어요.</div>}

      {!isLoading && !isError && (
        <div className="flex h-full min-h-0 flex-col">
          {data.length === 0 && <div className="text-sm text-neutral-500">회고가 없어요.</div>}

          {data.length > 0 && (
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="flex flex-col gap-4">
                {data.map((item, idx) => (
                  <div key={item.id} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {}}
                        className="font-['Inter'] text-sm font-medium text-neutral-500 hover:underline focus:outline-none"
                      >
                        {item.title}
                      </button>

                      <div className="flex items-center gap-5">
                        <div className="font-['Inter'] text-sm font-medium text-neutral-500">
                          {item.teamName}
                        </div>
                        <div className="font-['Inter'] text-sm font-medium text-neutral-500">
                          {formatMMDD(item.writtenDate)}
                        </div>
                      </div>
                    </div>

                    {idx !== data.length - 1 && (
                      <div className="h-0 self-stretch outline outline-1 outline-offset-[-0.50px] outline-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
