import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';

type GanttTask = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
};

const DAY_WIDTH = 18; // px per day
const VIEW_DAYS = 60; // days to display

const parseDate = (value?: string): Date | null => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const diffDaysInclusive = (start: Date, end: Date): number =>
  Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

const formatMonthLabel = (d: Date): string => `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
const formatDayLabel = (d: Date): string => `${d.getDate()}`;

const getAnchorDate = (tasks: GanttTask[]): Date => {
  const dates = tasks
    .map((t) => [parseDate(t.startDate), parseDate(t.endDate)])
    .flat()
    .filter((d): d is Date => d !== null);

  if (dates.length === 0) return new Date();

  const min = new Date(Math.min(...dates.map((d) => d.getTime())));
  const max = new Date(Math.max(...dates.map((d) => d.getTime())));
  const mid = new Date((min.getTime() + max.getTime()) / 2);
  return mid;
};

const buildTimeline = (anchor: Date, viewDays: number) => {
  const days: Date[] = [];
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - Math.floor(viewDays / 2));

  for (let i = 0; i < viewDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }

  return { start, days };
};

const GanttChart = ({ tasks }: { tasks: GanttTask[] }) => {
  const initialAnchor = getAnchorDate(tasks);
  const [anchorDate, setAnchorDate] = useState(initialAnchor);
  const timeline = buildTimeline(anchorDate, VIEW_DAYS);
  const totalWidth = timeline.days.length * DAY_WIDTH;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  // 스크롤 후 필요시 anchorDate 재조정 (무한 스크롤)
  const checkAndAdjustScroll = (scrollLeft: number) => {
    if (!scrollRef.current) return;
    const containerWidth = scrollRef.current.clientWidth;
    const contentWidth = totalWidth;

    // 좌측 끝에 가까우면 앞으로 확장
    if (scrollLeft < contentWidth * 0.2) {
      const newAnchor = new Date(anchorDate);
      newAnchor.setDate(anchorDate.getDate() - 10);
      setAnchorDate(newAnchor);
      // 스크롤 위치 유지
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollLeft + DAY_WIDTH * 10;
        }
      }, 0);
    }
    // 우측 끝에 가까우면 뒤로 확장
    else if (scrollLeft > contentWidth * 0.8 - containerWidth) {
      const newAnchor = new Date(anchorDate);
      newAnchor.setDate(anchorDate.getDate() + 10);
      setAnchorDate(newAnchor);
      // 스크롤 위치 유지
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollLeft - DAY_WIDTH * 10;
        }
      }, 0);
    }
  };

  const getTaskBarPosition = (start: Date, end: Date) => {
    const startDays = (start.getTime() - timeline.start.getTime()) / (1000 * 60 * 60 * 24);
    const duration = diffDaysInclusive(start, end);
    return {
      left: Math.max(0, startDays) * DAY_WIDTH,
      width: duration * DAY_WIDTH,
    };
  };

  // Month spans
  const monthSpans: { label: string; width: number }[] = [];
  timeline.days.forEach((day, idx) => {
    if (idx === 0) {
      monthSpans.push({ label: formatMonthLabel(day), width: DAY_WIDTH });
    } else {
      const prev = timeline.days[idx - 1];
      if (prev.getMonth() === day.getMonth()) {
        monthSpans[monthSpans.length - 1].width += DAY_WIDTH;
      } else {
        monthSpans.push({ label: formatMonthLabel(day), width: DAY_WIDTH });
      }
    }
  });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart(e.pageX);
    setScrollStart(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    const delta = e.pageX - dragStart;
    const newScrollLeft = scrollStart - delta;
    scrollRef.current.scrollLeft = newScrollLeft;
    checkAndAdjustScroll(newScrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex w-full overflow-hidden bg-white">
      {/* 좌측: 고정 업무명 컬럼 */}
      <div className="flex w-44 flex-shrink-0 flex-col">
        {/* Header */}
        <div className="flex h-12 items-center justify-center gap-2.5 bg-slate-100 outline outline-1 outline-offset-[-1px] outline-gray-200">
          <div className="text-center text-sm font-medium text-black">업무명</div>
        </div>

        {/* Task rows */}
        {tasks.map((task) => (
          <div key={`name-${task.id}`} className="flex h-12 flex-shrink-0 items-center justify-center border-b border-r border-gray-200 bg-white px-2 py-2">
            <div className="truncate text-center text-xs font-medium text-neutral-600 title={task.name}">
              {task.name}
            </div>
          </div>
        ))}
      </div>

      {/* 우측: 스크롤 가능한 타임라인 */}
      <div
        ref={scrollRef}
        className="flex-1 cursor-grab select-none overflow-x-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div style={{ width: totalWidth }}>
          {/* Header: Month labels */}
          <div className="flex h-6 items-center justify-start border-b border-gray-200 bg-white">
            {monthSpans.map((m, idx) => (
              <div
                key={idx}
                className="flex flex-shrink-0 items-center justify-center border-r border-gray-200 text-[10px] font-medium text-black"
                style={{ width: m.width }}
              >
                {m.label}
              </div>
            ))}
          </div>

          {/* Header: Day labels */}
          <div className="flex h-6 items-center justify-start border-b border-gray-200 bg-white">
            {timeline.days.map((day, idx) => (
              <div
                key={idx}
                className="flex flex-shrink-0 items-center justify-center border-r border-gray-200 text-[10px] font-normal text-neutral-500"
                style={{ width: DAY_WIDTH, height: 24 }}
              >
                {formatDayLabel(day)}
              </div>
            ))}
          </div>

          {/* Task rows */}
          {tasks.map((task) => {
            const taskStart = parseDate(task.startDate) ?? anchorDate;
            const taskEnd = parseDate(task.endDate) ?? taskStart;
            const barPos = getTaskBarPosition(taskStart, taskEnd);

            return (
              <div key={task.id} className="flex h-12 items-center justify-start border-b border-gray-200 bg-white">
                <div className="relative flex-shrink-0" style={{ width: totalWidth, height: 48 }}>
                  <div
                    className="absolute top-1/2 h-4 -translate-y-1/2 flex-shrink-0 rounded-tr-[5px] rounded-br-[5px] bg-orange-100"
                    style={{
                      left: `${barPos.left}px`,
                      width: `${barPos.width}px`,
                    }}
                  >
                    <div className="h-3.5 w-1/2 rounded-tr-[5px] rounded-br-[5px] bg-orange-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
