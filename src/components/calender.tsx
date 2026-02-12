/*
 *
 *  @author 곽도윤
 *
 *  @description
 *  캘린더 컴포넌트입니다.
 *
 *  @example
 *  // prev: 이전 날짜. 초기에 선택된 날짜로 설정됨.
 *  // next: 선택된 날짜 전달 콜백
 *  // onClose: 모달 닫기 핸들러
 *
 *  const [selectedDate, setSelectedDate] = React.useState<Date>(() => new Date());
 *  const [isCalendarOpen, setIsCalendarOpen] = React.useState<boolean>(false);
 *  <Calender
 *    prev={currentDate()}
 *    next={(date) => setSelectedDate(date)}
 *    onClose={() => setIsOpen(false)}
 *  />
 **/
import React from 'react';

import leftArrow from '@assets/icon-arrow-left-black.svg';
import rightArrow from '@assets/icon-arrow-right-black.svg';

type CalenderProps = {
  prev: Date;
  next: (date: Date) => void;
  onClose: () => void;
};

const Calender: React.FC<CalenderProps> = ({ prev, next, onClose }) => {
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

  while (days.length % 7 !== 0 || days.length < 42) {
    days.push({ day: days.length - (firstDay + daysInMonth) + 1, offset: 1 });
  }

  const dayClass = (isMuted: boolean, isHighlight: boolean) => {
    const base =
      "w-4 h-4 rounded-lg inline-flex flex-col justify-center items-center gap-2.5 text-center text-[10px] font-normal font-['Roboto']";
    if (isHighlight) return `${base} bg-orange-500 text-white`;
    if (isMuted) return `${base} text-gray-400`;
    return `${base} text-black`;
  };

  const formatLabel = `${year}년 ${month + 1}월`;

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
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

  return (
    <div
      ref={containerRef}
      className="relative h-56 w-72 overflow-hidden rounded-[20px] bg-white p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] outline outline-1 outline-offset-[-1px] outline-gray-200"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-3">
          <button
            type="button"
            aria-label="previous month"
            onClick={handlePrevMonth}
            className="flex h-3.5 w-3.5 items-center justify-center rounded-[6px] bg-white outline outline-1 outline-offset-[-1px] outline-gray-300"
          >
            <img src={leftArrow} alt="previous month" className="h-3 w-1" />
          </button>
          <div className="h-3.5 min-w-[72px] text-center font-['Roboto'] text-xs font-medium text-black">
            {formatLabel}
          </div>
          <button
            type="button"
            aria-label="next month"
            onClick={handleNextMonth}
            className="flex h-3.5 w-3.5 items-center justify-center rounded-[6px] bg-white outline outline-1 outline-offset-[-1px] outline-gray-300"
          >
            <img src={rightArrow} alt="next month" className="h-3 w-1" />
          </button>
        </div>

        <div className="inline-flex w-full items-center justify-between px-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="h-4 w-4 text-center font-['Roboto'] text-xs font-normal text-black"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid w-full grid-cols-7 gap-2">
          {days.map(({ day, offset }, idx) => {
            const cellDate = new Date(year, month + offset, day);
            const isCurrent = offset === 0;
            const isHighlight = isSameDate(selectedDate, cellDate) && isCurrent;
            return (
              <button
                type="button"
                key={`${offset}-${day}-${idx}`}
                onClick={() => handleSelectDay(day, offset)}
                className={dayClass(!isCurrent, isHighlight)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calender;
