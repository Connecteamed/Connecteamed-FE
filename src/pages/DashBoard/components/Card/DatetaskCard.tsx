import React from 'react';
import Card from '@/pages/DashBoard/components/Card/Card';
import type { DashboardCardNavProps } from '@/pages/DashBoard/types/types';
import DashboardCalender from '@/pages/DashBoard/components/DashboardCalender';
import { useDailySchedules } from '../../hooks/useDailySchedules';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatMMDD(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
}

export default function DatetaskCard({ onGoToTeam }: DashboardCardNavProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const { data, isLoading, isError } = useDailySchedules(selectedDate);

  const schedules = data?.schedules ?? [];

  return (
    <Card title="날짜별 업무">
      <div className="flex min-h-0 gap-11">
        <div className="w-[360px] flex items-center justify-center">
          <DashboardCalender
            prev={selectedDate}
            next={(date) => setSelectedDate(date)}
            onClose={() => {}}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-300" />

          {isLoading && (
            <div className="py-3 text-sm text-neutral-500">불러오는 중...</div>
          )}

          {isError && (
            <div className="py-3 text-sm text-red-500">일정을 불러오지 못했어요.</div>
          )}

          {!isLoading && !isError && schedules.length === 0 && (
            <div className="py-3 text-sm text-neutral-500">해당 날짜의 일정이 없어요.</div>
          )}

          {!isLoading &&
            !isError &&
            schedules.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />

                    <button
                      type="button"
                      onClick={() => {
                        // teamId가 응답에 추가되면 여기서 onGoToTeam(teamId)로 연결하면 됨
                      }}
                      className="text-left text-neutral-500 text-xs font-medium font-['Roboto'] hover:underline focus:outline-none"
                    >
                      {item.teamName}
                    </button>
                  </div>

                  <div className="text-neutral-500 text-xs font-medium font-['Roboto']">
                    {formatMMDD(item.time)}
                  </div>
                </div>

                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-300" />
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}
