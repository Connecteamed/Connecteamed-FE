type WorkLogTooltipProps = {
  date: Date;
  count: number;
  className?: string;
};

export default function WorkLogTooltip({ date, count, className = '' }: WorkLogTooltipProps) {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();

  return (
    <div
      className={`relative h-8 w-24 rounded-[10px] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] ${className}`}
    >
      <div className="absolute top-[4px] left-[7px] text-center text-[8px] leading-3 font-medium text-neutral-600">
        {yyyy}년 {mm}월 {dd}일 <br />
        {count}개의 업무를 처리했어요
      </div>
    </div>
  );
}
