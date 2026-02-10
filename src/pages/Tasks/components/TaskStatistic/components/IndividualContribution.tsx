import { useMemo, useState } from 'react';

/**
 * 개인 그래프 컴포넌트
 *
 * @author 류동현
 */

interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface PersonalContributionProps {
  name: string;
  contributions: Contribution[];
}

export const IndividualContribution = ({ name, contributions }: PersonalContributionProps) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const monthLabels = useMemo(() => {
    const labels: { month: string; colIndex: number }[] = [];
    let lastMonth = -1;

    contributions.forEach((item, index) => {
      if (index % 7 === 0) {
        const date = new Date(item.date);
        //js에서 월은 0부터 시작하므로 +1
        const currentMonth = date.getMonth() + 1;
        const currentDay = date.getDate();
        if (currentMonth !== lastMonth) {
          let targetColIndex = index / 7;
          if (currentDay > 1 && index > 0) {
            targetColIndex = index / 7 - 1;
          }
          labels.push({
            month: `${currentMonth}월`,
            colIndex: targetColIndex,
          });
          lastMonth = currentMonth;
        }
      }
    });
    return labels;
  }, [contributions]);

  const [hoveredData, setHoveredData] = useState<Contribution | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 레벨에 따른 배경색 매핑
  const getLevelColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-primary-700';
      case 3:
        return 'bg-primary-500';
      case 2:
        return 'bg-primary-300';
      case 1:
        return 'bg-primary-100';
      default:
        return 'bg-neutral-20';
    }
  };

  return (
    <div className="bg-neutral-0 relative w-[478px] rounded-[20px] px-[50px] py-[28px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <p className="text-neutral-90 mb-[24px] text-[18px] font-medium">{name} 님의 업무기록</p>

      <div className="flex">
        {/* 요일 라벨 */}
        <div className="mr-[16px] flex flex-col gap-[6px] pt-[22px] text-[8px] font-medium text-neutral-100">
          {days.map((day) => (
            <span className="py-[1px]" key={day}>
              {day}
            </span>
          ))}
        </div>

        <div className="flex flex-col">
          {/* 월 라벨 */}
          <div className="relative mb-[12px] h-[10px] text-[8px] font-medium text-neutral-100">
            {monthLabels.map(({ month, colIndex }) => (
              <span
                key={`${month}-${colIndex}`}
                className="absolute top-0 whitespace-nowrap"
                style={{
                  left: colIndex * 20,
                }}
              >
                {month}
              </span>
            ))}
          </div>

          {/* 잔디 */}
          <div className="grid grid-flow-col grid-rows-7 gap-[6px]">
            {contributions.map((item) => (
              <div
                key={item.date}
                className={`h-[14px] w-[14px] rounded-[3px] ${getLevelColor(item.level)}`}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  const left = target.offsetLeft + target.offsetWidth / 2;
                  const top = target.offsetTop;
                  setTooltipPos({ left, top });
                  setHoveredData(item);
                }}
                onMouseLeave={() => setHoveredData(null)}
              />
            ))}
          </div>
        </div>
      </div>

      {hoveredData && (
        <div
          className="bg-neutral-0 text-neutral-90 absolute z-50 flex h-[33px] w-[97px] flex-col items-center justify-center rounded-[10px] text-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          style={{
            left: tooltipPos.left,
            top: tooltipPos.top - 5,
            transform: 'translate(-50%, -100%)', // 중앙 위쪽 정렬
          }}
        >
          <span>{formatDate(hoveredData.date)}</span>
          <span>{hoveredData.count}개의 업무를 처리했어요</span>
        </div>
      )}
    </div>
  );
};

export default IndividualContribution;
