import React from 'react';
import leftArrow from '@assets/icon-arrow-left-black.svg';
import rightArrow from '@assets/icon-arrow-right-black.svg';

type CalenderProps = {
  prev: Date;
  next: (date: Date) => void;
  onClose: () => void;
};

const DashboardCalender: React.FC<CalenderProps> = ({ prev, next, onClose }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const [currentDate, setCurrentDate] = React.useState(() => new Date(prev));
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(() => new Date(prev));

  React.useEffect(() => {
    setCurrentDate(new Date(prev));
    setSelectedDate(new Date(prev));
  }, [prev]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonthDays = Array.from(
    { length: firstDay },
    (_, idx) => daysInPrevMonth - firstDay + idx + 1,
  );
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);

  const days: Array<{ day: number; offset: -1 | 0 | 1 }> = [
    ...prevMonthDays.map((day) => ({ day, offset: -1 as const })),
    ...currentMonthDays.map((day) => ({ day, offset: 0 as const })),
  ];

  while (days.length < 35) {
    days.push({ day: days.length - (firstDay + daysInMonth) + 1, offset: 1 });
  }

  const handlePrevMonth = () => {
    setCurrentDate((prevD) => new Date(prevD.getFullYear(), prevD.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevD) => new Date(prevD.getFullYear(), prevD.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number, offset: -1 | 0 | 1) => {
    const target = new Date(year, month + offset, day);
    setSelectedDate(target);
    setCurrentDate(new Date(target.getFullYear(), target.getMonth(), 1));
    next(target);
    onClose();
  };

  const isSameDate = (a: Date | null, b: Date) =>
    a?.getFullYear() === b.getFullYear() &&
    a?.getMonth() === b.getMonth() &&
    a?.getDate() === b.getDate();

  const formatLabel = `${year}년 ${month + 1}월`;

  const cellClass = (cellDate: Date, offset: -1 | 0 | 1) => {
    const isMuted = offset !== 0;
    const isSelected = isSameDate(selectedDate, cellDate) && offset === 0;

    const dow = cellDate.getDay();
    const isSunday = dow === 0;
    const isSaturday = dow === 6;

    const base = "w-5 h-5 flex items-center justify-center text-sm font-normal font-['Roboto']";

    if (isSelected) return `${base} bg-orange-500 text-white rounded-xl`;

    if (isMuted) return `${base} text-gray-300`;

    if (isSunday) return `${base} text-red-500`;
    if (isSaturday) return `${base} text-blue-700`;

    return `${base} text-black`;
  };

  return (
    <div ref={containerRef} className="w-[360px] mx-auto">
      <div className="w-full inline-flex flex-col items-center gap-4">
        <div className="w-full inline-flex items-end justify-between">
          <button
            type="button"
            aria-label="previous month"
            onClick={handlePrevMonth}
            className="w-7 h-7 px-1 py-[3px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 flex items-center justify-center"
          >
            <img src={leftArrow} alt="previous month" className="w-3 h-3" />
          </button>

          <div className="flex items-center justify-center gap-3.5">
            <div className="w-24 h-6 text-center text-black text-base font-medium font-['Roboto'] leading-4">
              {formatLabel}
            </div>
          </div>

          <button
            type="button"
            aria-label="next month"
            onClick={handleNextMonth}
            className="w-7 h-7 px-1 py-[3px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 flex items-center justify-center"
          >
            <img src={rightArrow} alt="next month" className="w-3 h-3" />
          </button>
        </div>

        <div className="w-full">
          {/* 요일 */}
          <div className="grid grid-cols-7 gap-x-[26px] gap-y-[24px]">
            {weekDays.map((d) => (
              <div
                key={d}
                className="w-5 h-5 text-center text-black text-sm font-medium font-['Inter']"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-x-[26px] gap-y-[24px]">
            {days.map(({ day, offset }, idx) => {
              const cellDate = new Date(year, month + offset, day);
              return (
                <button
                  type="button"
                  key={`${offset}-${day}-${idx}`}
                  onClick={() => handleSelectDay(day, offset)}
                  className={cellClass(cellDate, offset)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCalender;
