// src/pages/Dashboard/components/WorkRecordCard.tsx
import React from 'react';
import Card from './Card'; // ✅ 실제 Card.tsx 위치에 맞게 경로만 조정해줘

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
  // 6등분(각 month 구간을 “균등 폭”으로 만들어서 라벨 정렬용)
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

  // “주 단위 컬럼”처럼 7개씩 끊어서 세로로 쌓고, 그 묶음을 옆으로 나열
  const weeks: Level[][] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));

  // 위/아래 2줄로 나누기(1~6 / 7~12)
  const half = Math.ceil(weeks.length / 2);
  const topWeeks = weeks.slice(0, half);
  const bottomWeeks = weeks.slice(half);

  // ✅ 라벨 정렬을 위해 “6등분” (폭 계산용)
  const topSegments = splitIntoSix(topWeeks);
  const bottomSegments = splitIntoSix(bottomWeeks);

  // 한 세그먼트(월 구간)의 “픽셀 폭” = (컬럼 수 * CELL) + (컬럼 사이 GAP)
  const segWidthPx = (cols: number) => cols * CELL + Math.max(0, cols - 1) * GAP;

  const MonthRow = ({ labels, segments }: { labels: readonly string[]; segments: Level[][][] }) => (
    <div className="flex items-center">
      {/* 요일 라벨 자리만큼 왼쪽 여백(피그마처럼) */}
      <div className="w-2" />
      <div className="flex items-center">
        {labels.map((m, i) => (
          <div
            key={m}
            className="text-black text-[10px] font-medium font-['Roboto']"
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
      {/* 요일 */}
      <div className="w-2 inline-flex flex-col justify-start items-start gap-1 mr-1.5">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="h-[14px] leading-[14px] text-black text-[10px] font-medium font-['Roboto']"
          >
            {d}
          </div>
        ))}
      </div>

      {/* 잔디: “월 구간” 구분 없이 그냥 한 줄로 쭉 이어 붙이기 */}
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
    <Card
      title="업무 기록"
      className="flex flex-col w-full h-full "
    >
      {/* ✅ Card.tsx가 이미 mt-6(=24px)로 헤더↔내용 간격 만들어줌 */}
      <div className="flex flex-col h-full min-h-0">
        {/* 상단(1~6월) */}
        <div className="flex flex-col gap-2.5">
          <MonthRow labels={MONTHS_TOP} segments={topSegments} />
          <GrassRow weeksChunk={topWeeks} />
        </div>

        {/* ✅ 1~6과 7~12 사이 간격: 기존보다 줄이기 */}
        <div className="h-4" />

        {/* 하단(7~12월) */}
        <div className="flex flex-col gap-2.5">
          <MonthRow labels={MONTHS_BOTTOM} segments={bottomSegments} />
          <GrassRow weeksChunk={bottomWeeks} />
        </div>

        {/* ✅ 범례: 오른쪽 아래로 “올려서”, 카드 내부에서 안 잘리게 */}
        <div className="flex justify-end mt-3">
          <div className="inline-flex justify-start items-center gap-1.5">
            <div className="text-neutral-500 text-[10px] font-medium font-['Roboto']">적음</div>
            <div className="flex items-center justify-start gap-1">
              <div className="rounded-[3px] bg-gray-100" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-100" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-300" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-500" style={{ width: CELL, height: CELL }} />
              <div className="rounded-[3px] bg-orange-600" style={{ width: CELL, height: CELL }} />
            </div>
            <div className="text-neutral-500 text-[10px] font-medium font-['Roboto']">많음</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
