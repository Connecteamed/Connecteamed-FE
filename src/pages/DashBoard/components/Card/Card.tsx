import React from 'react';

type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string; // 카드별 레이아웃/오버플로우 등 확장용
};

export default function DashboardCard({ title, children, className = '' }: DashboardCardProps) {
  return (
    <section
      className={[
        'rounded-[20px] bg-white',
        'shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]',
        'overflow-hidden p-[27px]',
        className,
      ].join(' ')}
    >
      <div className="flex h-full flex-col">
        <h2 className="font-['Roboto'] text-2xl font-medium text-neutral-600">{title}</h2>

        {/* 카드 내용 */}
        <div className="mt-6 min-h-0 flex-1">{children}</div>
      </div>
    </section>
  );
}
