import CardLayout from '@pages/DashBoard/layouts/CardLayout';

export default function Dashboard() {
  return (
    <div className="h-full w-full px-[53px] py-[60px] overflow-hidden flex flex-col">
      <div className="shrink-0">
        <h1 className="text-black text-5xl font-bold font-['Roboto']">Dashboard</h1>
      </div>

      {/* 카드 영역 */}
      <div className="mt-[53px] flex-1 min-h-0">
        <CardLayout />
      </div>
    </div>
  );
}
