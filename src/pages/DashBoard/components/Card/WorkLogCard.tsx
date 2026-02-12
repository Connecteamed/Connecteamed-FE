import { useEffect, useMemo, useRef, useState } from 'react';

import {
  type ContributionDay,
  type ContributionLevel,
  getAnnualContributionCalendar,
} from '@/pages/DashBoard/apis/dashboardApi';
import Card from '@/pages/DashBoard/components/Card/Card';

import WorkLogTooltip from './WorkLogTooltip';

const YEAR = new Date().getFullYear();
type Level = ContributionLevel;
type Cell = Level | null;

const CELL = 14;
const GAP = 6;
const ROW_GAP = 6;
const LABEL_H = 10;

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const MONTHS_TOP = [
  { month0: 0, label: '1월' },
  { month0: 1, label: '2월' },
  { month0: 2, label: '3월' },
  { month0: 3, label: '4월' },
  { month0: 4, label: '5월' },
  { month0: 5, label: '6월' },
] as const;
const MONTHS_BOTTOM = [
  { month0: 6, label: '7월' },
  { month0: 7, label: '8월' },
  { month0: 8, label: '9월' },
  { month0: 9, label: '10월' },
  { month0: 10, label: '11월' },
  { month0: 11, label: '12월' },
] as const;

const levelToBg: Record<Level, string> = {
  0: 'bg-gray-100',
  1: 'bg-orange-100',
  2: 'bg-orange-300',
  3: 'bg-orange-500',
  4: 'bg-orange-600',
};

function resolveAnyProjectId(): number | null {
  const candidates = [
    'projectId',
    'currentProjectId',
    'selectedProjectId',
    'activeProjectId',
    'lastProjectId',
  ];

  for (const key of candidates) {
    const raw = localStorage.getItem(key);
    const n = raw ? Number(raw) : NaN;
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function getDaysInYear(year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function dayOfYearIndex(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  start.setHours(0, 0, 0, 0);

  const cur = new Date(date);
  cur.setHours(0, 0, 0, 0);

  return Math.floor((cur.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function diffDays(a: Date, b: Date) {
  const aa = new Date(a);
  const bb = new Date(b);
  aa.setHours(0, 0, 0, 0);
  bb.setHours(0, 0, 0, 0);
  return Math.floor((aa.getTime() - bb.getTime()) / (1000 * 60 * 60 * 24));
}

function startOfWeekSunday(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function endOfWeekSaturday(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() + (6 - x.getDay()));
  return x;
}

function buildRangeWeekGrid(year: number, rangeStart: Date, rangeEnd: Date, yearLevels: Level[]) {
  const gridStart = startOfWeekSunday(rangeStart);
  const gridEnd = endOfWeekSaturday(rangeEnd);

  const totalDays = diffDays(gridEnd, gridStart) + 1;
  const weeks = Math.ceil(totalDays / 7);

  const cols: Cell[][] = Array.from({ length: weeks }, () => Array<Cell>(7).fill(null));

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);

    const col = Math.floor(i / 7);
    const row = d.getDay();

    if (d < rangeStart || d > rangeEnd) continue;
    if (d.getFullYear() !== year) continue;

    const doy = dayOfYearIndex(d);
    cols[col][row] = yearLevels[doy] ?? 0;
  }

  return { cols, gridStart };
}

function calcMonthStartsBySundayMonth(
  year: number,
  months: ReadonlyArray<{ month0: number; label: string }>,
  gridStart: Date,
  colsLen: number,
) {
  return months.map(({ month0 }) => {
    for (let col = 0; col < colsLen; col++) {
      const sunday = new Date(gridStart);
      sunday.setDate(gridStart.getDate() + col * 7);
      if (sunday.getFullYear() === year && sunday.getMonth() === month0) return col;
    }
    const first = new Date(year, month0, 1);
    const dayOffset = diffDays(first, gridStart);
    return Math.floor(dayOffset / 7);
  });
}

function MonthLabelsRow({
  monthStarts,
  labels,
}: {
  monthStarts: number[];
  labels: readonly string[];
}) {
  return (
    <div className="relative" style={{ height: LABEL_H }}>
      {labels.map((label, i) => {
        const shiftLeftOneCell = label === '1월' || label === '7월';
        const left = (monthStarts[i] - (shiftLeftOneCell ? 1 : 0)) * (CELL + GAP);

        return (
          <div
            key={label}
            className="absolute font-['Roboto'] text-[8px] font-medium text-black"
            style={{ left, top: 0, height: LABEL_H, lineHeight: `${LABEL_H}px` }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

function DayLabels() {
  return (
    <div className="mr-3 inline-flex flex-col" style={{ rowGap: GAP }}>
      <div style={{ height: LABEL_H }} />
      {DAY_LABELS.map((d) => (
        <div
          key={d}
          className="font-['Roboto'] text-[8px] font-medium text-black"
          style={{ height: CELL, lineHeight: `${CELL}px` }}
        >
          {d}
        </div>
      ))}
    </div>
  );
}

function GridRow({
  cols,
  gridStart,
  countsByDoy,
  onHover,
}: {
  cols: Cell[][];
  gridStart: Date;
  countsByDoy: number[];
  onHover: (info: { date: Date; count: number; clientX: number; clientY: number } | null) => void;
}) {
  return (
    <div className="flex flex-nowrap items-start" style={{ columnGap: GAP }}>
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col" style={{ rowGap: GAP }}>
          {DAY_LABELS.map((_, ri) => {
            const cell = col[ri];
            if (cell === null) return <div key={ri} style={{ width: CELL, height: CELL }} />;

            const d = new Date(gridStart);
            d.setDate(gridStart.getDate() + ci * 7 + ri);
            const doy = dayOfYearIndex(d);
            const count = countsByDoy[doy] ?? 0;

            const bg = levelToBg[cell as Level];

            return (
              <div
                key={ri}
                className={`rounded-[3px] ${bg}`}
                style={{ width: CELL, height: CELL }}
                onMouseEnter={(e) =>
                  onHover({ date: d, count, clientX: e.clientX, clientY: e.clientY })
                }
                onMouseMove={(e) =>
                  onHover({ date: d, count, clientX: e.clientX, clientY: e.clientY })
                }
                onMouseLeave={() => onHover(null)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

type HoverInfo = { date: Date; count: number; x: number; y: number };

function buildLevelAndCountByDoy(year: number, contributions: ContributionDay[]) {
  const days = getDaysInYear(year);
  const levels: Level[] = Array.from({ length: days }, () => 0);
  const counts: number[] = Array.from({ length: days }, () => 0);

  for (const c of contributions) {
    const d = new Date(c.date);
    if (d.getFullYear() !== year) continue;
    const doy = dayOfYearIndex(d);
    if (doy < 0 || doy >= days) continue;
    levels[doy] = c.level;
    counts[doy] = c.count;
  }

  return { levels, counts };
}

export default function WorkLogCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<HoverInfo | null>(null);

  const projectId = useMemo(() => resolveAnyProjectId(), []);
  const [yearLevels, setYearLevels] = useState<Level[]>(() =>
    Array.from({ length: getDaysInYear(YEAR) }, () => 0),
  );
  const [yearCounts, setYearCounts] = useState<number[]>(() =>
    Array.from({ length: getDaysInYear(YEAR) }, () => 0),
  );

  useEffect(() => {
    if (!projectId) {
      console.warn('[WorkLogCard] projectId not found (required by API).');
      return;
    }

    let alive = true;
    (async () => {
      try {
        const data = await getAnnualContributionCalendar({ projectId, year: YEAR });
        if (!alive) return;

        const { levels, counts } = buildLevelAndCountByDoy(YEAR, data.contributions ?? []);
        setYearLevels(levels);
        setYearCounts(counts);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [projectId]);

  const handleHover = (
    info: { date: Date; count: number; clientX: number; clientY: number } | null,
  ) => {
    if (!info) return setHover(null);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return setHover(null);

    setHover({
      date: info.date,
      count: info.count,
      x: info.clientX - rect.left,
      y: info.clientY - rect.top,
    });
  };

  const rangeTopStart = new Date(YEAR, 0, 1);
  const rangeTopEnd = new Date(YEAR, 5, 30);
  const top = useMemo(
    () => buildRangeWeekGrid(YEAR, rangeTopStart, rangeTopEnd, yearLevels),
    [yearLevels],
  );
  const topStarts = useMemo(
    () => calcMonthStartsBySundayMonth(YEAR, MONTHS_TOP, top.gridStart, top.cols.length),
    [top.gridStart, top.cols.length],
  );

  const rangeBottomStart = new Date(YEAR, 6, 1);
  const rangeBottomEnd = new Date(YEAR, 11, 31);
  const bottom = useMemo(
    () => buildRangeWeekGrid(YEAR, rangeBottomStart, rangeBottomEnd, yearLevels),
    [yearLevels],
  );
  const bottomStarts = useMemo(
    () => calcMonthStartsBySundayMonth(YEAR, MONTHS_BOTTOM, bottom.gridStart, bottom.cols.length),
    [bottom.gridStart, bottom.cols.length],
  );

  return (
    <Card title="업무 기록" className="flex h-full w-full flex-col">
      <div ref={containerRef} className="relative flex h-full min-h-0 flex-col">
        {hover && (
          <div
            className="pointer-events-none absolute z-10"
            style={{ left: Math.round(hover.x + 8), top: Math.round(hover.y - 40) }}
          >
            <WorkLogTooltip date={hover.date} count={hover.count} />
          </div>
        )}

        {/* 1~6월 */}
        <div className="-mt-[7px] flex">
          <DayLabels />
          <div className="flex flex-col" style={{ rowGap: ROW_GAP }}>
            <MonthLabelsRow monthStarts={topStarts} labels={MONTHS_TOP.map((m) => m.label)} />
            <GridRow
              cols={top.cols}
              gridStart={top.gridStart}
              countsByDoy={yearCounts}
              onHover={handleHover}
            />
          </div>
        </div>

        <div className="h-6" />

        {/* 7~12월 */}
        <div className="flex">
          <DayLabels />
          <div className="flex flex-col" style={{ rowGap: ROW_GAP }}>
            <MonthLabelsRow monthStarts={bottomStarts} labels={MONTHS_BOTTOM.map((m) => m.label)} />
            <GridRow
              cols={bottom.cols}
              gridStart={bottom.gridStart}
              countsByDoy={yearCounts}
              onHover={handleHover}
            />
          </div>
        </div>

        {/* 범례 */}
        <div className="mt-3 flex justify-end">
          <div className="inline-flex items-center justify-start gap-1.5">
            <div className="font-['Roboto'] text-[8px] font-medium text-neutral-500">적음</div>
            <div className="flex items-center justify-start gap-1">
              <div className="rounded-[3px] bg-gray-100" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-100" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-300" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-500" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-600" style={{ width: CELL, height: CELL }} />
            </div>
            <div className="font-['Roboto'] text-[8px] font-medium text-neutral-500">많음</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
