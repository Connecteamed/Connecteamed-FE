type GanttTask = {
  id: string;
  name: string;
  startDate?: string;
  endDate?: string;
};

const dayWidth = 18; // px per day

const parseDate = (value?: string) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const diffDaysInclusive = (start: Date, end: Date) => {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.floor(ms / (1000 * 60 * 60 * 24)) + 1);
};

const formatMonthLabel = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
const formatDayLabel = (d: Date) => `${d.getDate()}`;

const buildTimeline = (tasks: GanttTask[]) => {
  const dates = tasks
    .map((t) => [parseDate(t.startDate), parseDate(t.endDate)])
    .flat()
    .filter((d): d is Date => !!d);

  const min = dates.length > 0 ? new Date(Math.min(...dates.map((d) => d.getTime()))) : new Date();
  const max = dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : new Date();

  // Ensure at least a 14-day window
  const spanDays = Math.max(14, diffDaysInclusive(min, max));
  const end = new Date(min);
  end.setDate(end.getDate() + (spanDays - 1));

  const days: Date[] = [];
  const cursor = new Date(min);
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return { start: min, end, days };
};

const GanttChart = ({ tasks }: { tasks: GanttTask[] }) => {
  const timeline = buildTimeline(tasks);
  const totalWidth = timeline.days.length * dayWidth;

  // Group month labels: collect first day index of each month in the range
  const monthSpans: { label: string; width: number }[] = [];
  let currentMonth = timeline.days[0]?.getMonth();
  let currentCount = 0;
  timeline.days.forEach((day, idx) => {
    if (idx === 0) {
      currentMonth = day.getMonth();
      currentCount = 1;
      monthSpans.push({ label: formatMonthLabel(day), width: dayWidth });
      return;
    }
    if (day.getMonth() === currentMonth) {
      monthSpans[monthSpans.length - 1].width += dayWidth;
    } else {
      currentMonth = day.getMonth();
      monthSpans.push({ label: formatMonthLabel(day), width: dayWidth });
    }
    currentCount += 1;
  });

  return (
    <div className="inline-flex w-full flex-col items-start justify-start">
      <div className="inline-flex w-full items-center justify-start">
        <div className="flex h-12 w-44 items-center justify-center gap-2.5 bg-slate-100 p-3.5 outline outline-1 outline-offset-[-1px] outline-gray-200">
          <div className="flex-1 text-center text-sm font-medium text-black">업무명</div>
        </div>
        <div className="inline-flex h-12 items-center justify-start border-b border-r border-t border-gray-200 bg-white px-3.5 py-2">
          <div className="flex flex-col items-start justify-start" style={{ width: totalWidth }}>
            <div className="flex w-full items-center justify-start">
              {monthSpans.map((m) => (
                <div key={m.label} className="flex items-center justify-center text-[10px] text-black" style={{ width: m.width }}>
                  {m.label}
                </div>
              ))}
            </div>
            <div className="grid w-full grid-flow-col items-center justify-start" style={{ gridTemplateColumns: `repeat(${timeline.days.length}, ${dayWidth}px)` }}>
              {timeline.days.map((day, idx) => (
                <div
                  key={day.toISOString() + idx}
                  className="flex h-4 w-[18px] items-center justify-center text-[10px] font-normal text-neutral-500"
                >
                  {formatDayLabel(day)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tasks.map((task) => {
        const start = parseDate(task.startDate) ?? timeline.start;
        const end = parseDate(task.endDate) ?? start;
        const offsetDays = Math.max(0, Math.floor((start.getTime() - timeline.start.getTime()) / (1000 * 60 * 60 * 24)));
        const spanDays = diffDaysInclusive(start, end);

        return (
          <div key={task.id} className="inline-flex w-full items-center justify-start">
            <div className="flex h-12 w-44 items-center justify-center gap-2.5 border-b border-l border-r border-gray-200 bg-white px-3.5 py-2">
              <div className="flex-1 text-center text-xs font-medium text-neutral-600">{task.name}</div>
            </div>
            <div className="flex h-12 items-center justify-start border-b border-r border-gray-200 bg-white py-3.5">
              <div className="relative" style={{ width: totalWidth }}>
                <div
                  className="absolute top-1/2 h-4 -translate-y-1/2 rounded-tr-[5px] rounded-br-[5px] bg-orange-100"
                  style={{ left: offsetDays * dayWidth, width: spanDays * dayWidth }}
                >
                  <div className="h-3.5 w-1/2 bg-orange-500 rounded-tr-[5px] rounded-br-[5px]" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GanttChart;
