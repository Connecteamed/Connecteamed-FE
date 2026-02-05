import Card from '@/pages/DashBoard/components/Card/Card';

type Level = 0 | 1 | 2 | 3 | 4;

const levelToBg: Record<Level, string> = {
  0: 'bg-gray-100',
  1: 'bg-orange-100',
  2: 'bg-orange-300',
  3: 'bg-orange-500',
  4: 'bg-orange-600',
};

// 임시 목업(나중에 1년치 API로 교체)
function makeMockYear(): Level[] {
  return Array.from({ length: 365 }, (_, i) => {
    const r = (i * 17) % 10;
    if (r < 6) return 0;
    if (r < 8) return 1;
    if (r < 9) return 2;
    return 3;
  }) as Level[];
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const MONTHS_TOP = ['1월', '2월', '3월', '4월', '5월', '6월'] as const;
const MONTHS_BOTTOM = ['7월', '8월', '9월', '10월', '11월', '12월'] as const;

// 셀/간격(피그마에서 w-3.5(14px), gap-1(4px) 느낌)
const CELL = 14; // px
const GAP = 4; // px

function splitIntoSix<T>(arr: T[]) {
  const base = Math.floor(arr.length / 6);
  const rem = arr.length % 6;

  const res: T[][] = [];
  let idx = 0;
  for (let i = 0; i < 6; i++) {
    const size = base + (i < rem ? 1 : 0);
    res.push(arr.slice(idx, idx + size));
    idx += size;
  }
  return res;
}

export default function WorkLogCard() {
  const data = makeMockYear();

  const weeks: Level[][] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));

  const half = Math.ceil(weeks.length / 2);
  const topWeeks = weeks.slice(0, half);
  const bottomWeeks = weeks.slice(half);

  const topSegments = splitIntoSix(topWeeks);
  const bottomSegments = splitIntoSix(bottomWeeks);

  const segWidthPx = (cols: number) => cols * CELL + Math.max(0, cols - 1) * GAP;

  const MonthRow = ({ labels, segments }: { labels: readonly string[]; segments: Level[][][] }) => (
    <div className="flex items-center">
      <div className="w-2" />
      <div className="flex items-center">
        {labels.map((m, i) => (
          <div
            key={m}
            className="font-['Roboto'] text-[10px] font-medium text-black"
            style={{ width: segWidthPx(segments[i].length) }}
          >
            {m}
          </div>
        ))}
      </div>
    </div>
  );

  const GrassRow = ({ weeksChunk }: { weeksChunk: Level[][] }) => (
    <div className="inline-flex items-start">
      <div className="mr-1.5 inline-flex w-2 flex-col items-start justify-start gap-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="h-[14px] font-['Roboto'] text-[10px] leading-[14px] font-medium text-black"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="flex items-start gap-1">
        {weeksChunk.map((week, wi) => (
          <div key={wi} className="inline-flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, di) => {
              const level = (week[di] ?? 0) as Level;
              return (
                <div
                  key={di}
                  className={`rounded-[3px] ${levelToBg[level]}`}
                  style={{ width: CELL, height: CELL }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card title="업무 기록" className="flex h-full w-full flex-col">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex flex-col gap-2.5">
          <MonthRow labels={MONTHS_TOP} segments={topSegments} />
          <GrassRow weeksChunk={topWeeks} />
        </div>

        <div className="h-4" />

        <div className="flex flex-col gap-2.5">
          <MonthRow labels={MONTHS_BOTTOM} segments={bottomSegments} />
          <GrassRow weeksChunk={bottomWeeks} />
        </div>

        <div className="mt-3 flex justify-end">
          <div className="inline-flex items-center justify-start gap-1.5">
            <div className="font-['Roboto'] text-[10px] font-medium text-neutral-500">적음</div>
            <div className="flex items-center justify-start gap-1">
              <div className="rounded-[3px] bg-gray-100" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-100" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-300" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-500" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-600" style={{ width: CELL, height: CELL }} />
            </div>
            <div className="font-['Roboto'] text-[10px] font-medium text-neutral-500">많음</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
