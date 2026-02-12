import CardLayout from '@pages/DashBoard/layouts/CardLayout';

export default function Dashboard() {
  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-l from-white to-zinc-100">
      {/* Figma 기준: Sidebar 제외 메인 영역 1140 */}
      <div className="mx-auto flex h-full w-full flex-col px-14 py-20 xl:w-[1140px]">
        <div className="shrink-0">
          <h1 className="font-['Roboto'] text-5xl font-bold text-black">Dashboard</h1>
        </div>

        {/* 카드 영역 (Figma gap-10 = 40px) */}
        <div className="mt-10 min-h-0 flex-1">
          <CardLayout />
        </div>
      </div>
    </div>
  );
}
