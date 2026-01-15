import Card from '@/pages/DashBoard/components/Card/Card';
import { alarmItems } from '@pages/DashBoard/constants/dashboard';
import type { DashboardCardNavProps } from '@/pages/DashBoard/types/types';

export default function AlarmCard({ onGoToTeam }: DashboardCardNavProps) {
  return (
    <Card title="알림">
      <div className="flex flex-col gap-4">
        {alarmItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />

            <button
              type="button"
              onClick={() => onGoToTeam(item.teamId)}
              className="flex-1 text-left text-neutral-600 text-sm font-medium font-['Inter']
                         hover:underline focus:outline-none"
            >
              {item.message}
            </button>

            <div className="text-neutral-600 text-sm font-medium font-['Inter']">
              {item.projectName}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
