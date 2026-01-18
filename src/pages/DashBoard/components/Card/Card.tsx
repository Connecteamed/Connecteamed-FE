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
        'bg-white rounded-[20px]',
        'shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]',
        'p-[27px] overflow-hidden',
        className,
      ].join(' ')}
    >
      <div className="h-full flex flex-col">
        <h2 className="text-neutral-600 text-2xl font-medium font-['Roboto']">{title}</h2>

        {/* 카드 내용 */}
        <div className="mt-6 min-h-0">{children}</div>
      </div>
    </section>
  );
}
