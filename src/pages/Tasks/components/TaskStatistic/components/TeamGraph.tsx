import useGetProjectContributions from '@/hooks/TaskPage/Query/useGetProjectContributions';

interface Props {
  projectId: number;
}

export const TeamGraph = ({ projectId }: Props) => {
  const MAX_Y = 10;
  const { data: contributionsData, error } = useGetProjectContributions(projectId);
  // 업무 완료 수에 따른 색상 결정 함수
  const getBarColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-primary-100';
    if (count <= 4) return 'bg-primary-300';
    if (count <= 6) return 'bg-primary-500';
    if (count <= 8) return 'bg-primary-700';
    return 'bg-primary-900';
  };

  // 날짜 포맷 처리 함수
  const formatXAxisLabel = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return (
    <div className="bg-neutral-0 hidden w-full max-w-[980px] min-w-[700px] rounded-[20px] px-[30px] pt-[16px] pb-[26px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] min-[540px]:block">
      <h2 className="text-neutral-90 mb-[16px] text-[18px] font-medium">팀 전체 업무 통계</h2>

      <div className="flex">
        <div className="border-neutral-60 relative h-[150px] flex-1 border-x">
          {/* 격자 라인 배경 */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            <div className="border-neutral-60 w-full border-t"></div>
            <div className="border-neutral-60 w-full border-t"></div>
            <div className="border-neutral-60 w-full border-t"></div>
          </div>

          {/*막대 그래프 */}
          <div className="relative flex h-full items-end justify-between gap-[5px]">
            {contributionsData?.map((item) => {
              const heightPercent = Math.min((item.count / MAX_Y) * 100, 100);
              return (
                <div key={item.date} className="group flex h-full w-full flex-col items-center">
                  <div
                    className={`mt-auto w-full rounded-t-[8px] ${getBarColor(item.count)}`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>

                  <span className="text-neutral-90 absolute -bottom-[26px] text-[16px] whitespace-nowrap">
                    {formatXAxisLabel(item.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Y축 라벨 */}
        <div className="text-neutral-90 relative ml-[8px] flex h-[147px] flex-col items-start justify-between text-[16px] font-medium">
          <span>10</span>
          <span>5</span>
          <span>0</span>
          <div className="text-neutral-90 absolute mt-[75px] rotate-90 text-[14px] whitespace-nowrap">
            완료한 업무
          </div>
        </div>
      </div>

      <div className="h-[29px]"></div>
    </div>
  );
};

export default TeamGraph;
