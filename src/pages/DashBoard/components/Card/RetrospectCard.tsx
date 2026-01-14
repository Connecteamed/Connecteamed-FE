import Card from '@/pages/DashBoard/components/Card/Card';
import { retrospectItems } from '@pages/DashBoard/constants/dashboard';
import type { DashboardCardNavProps } from '@/pages/DashBoard/types/types';

export default function RetrospectCard({ onGoToTeam }: DashboardCardNavProps) {
  return (
    <Card title="회고 목록">
      <div className="flex flex-col gap-4">
        {retrospectItems.map((item, idx) => (
          <div key={item.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => onGoToTeam(item.teamId)}
                className="text-neutral-500 text-sm font-medium font-['Inter'] hover:underline focus:outline-none"
              >
                {item.title}
              </button>

              <div className="flex items-center gap-5">
                <div className="text-neutral-500 text-sm font-medium font-['Inter']">
                  {item.projectName}
                </div>
                <div className="text-neutral-500 text-sm font-medium font-['Inter']">
                  {item.date}
                </div>
              </div>
            </div>

            {idx !== retrospectItems.length - 1 && (
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-300" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
