import Card from '@/pages/DashBoard/components/Card/Card';
import { comingTaskItems } from '@pages/DashBoard/constants/dashboard';
import type { DashboardCardNavProps } from '@/pages/DashBoard/types/types';

export default function ComingtaskCard({ onGoToTeam }: DashboardCardNavProps) {
  return (
    <Card title="다가오는 업무">
      <div className="flex flex-col gap-4">
        {comingTaskItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div
              className={`w-20 h-7 rounded-[20px] flex items-center justify-center ${
                item.status === '시작 전' ? 'bg-zinc-200' : 'bg-orange-100'
              }`}
            >
              <span className="text-xs font-medium">{item.status}</span>
            </div>

            <div className="flex-1 flex justify-between">
              <button onClick={() => onGoToTeam(item.teamId)} className="text-sm hover:underline">
                {item.title}
              </button>

              <div className="flex gap-5 text-sm text-neutral-500">
                <span>{item.projectName}</span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
