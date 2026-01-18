import React from 'react';
import Card from '@/pages/DashBoard/components/Card/Card';
import type { DashboardCardNavProps } from '@/pages/DashBoard/types/types';
import { dateTaskItems } from '@/pages/DashBoard/constants/dashboard';
import DashboardCalender from '@/pages/DashBoard/components/DashboardCalender';

export default function DatetaskCard({ onGoToTeam }: DashboardCardNavProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  return (
    <Card title="날짜별 업무">
      <div className="flex gap-11 min-h-0">
        <div className="w-[360px] flex items-center justify-center">
          <DashboardCalender
            prev={selectedDate}
            next={(date) => setSelectedDate(date)}
            onClose={() => {}}
          />
        </div>

        {/* ✅ 우측 리스트 */}
        <div className="flex-1 min-w-0">
          <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-300" />

          {dateTaskItems.map((item) => (
            <div key={item.id}>
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />

                  {/* 프로젝트명(버튼)만 클릭 시 이동 */}
                  <button
                    type="button"
                    onClick={() => onGoToTeam(item.teamId)}
                    className="text-left text-neutral-500 text-xs font-medium font-['Roboto'] hover:underline focus:outline-none"
                  >
                    {item.projectName}
                  </button>
                </div>

                <div className="text-neutral-500 text-xs font-medium font-['Roboto']">
                  {item.date}
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
