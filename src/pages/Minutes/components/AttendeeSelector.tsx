import { useEffect, useRef, useState } from 'react';

import checkIcon from '@/assets/icon-check-white.svg';

// 팀원 더미 데이터
const DUMMY_MEMBERS = [
  { id: 1, name: '팀원1' },
  { id: 2, name: '팀원2' },
  { id: 3, name: '팀원3' },
  { id: 4, name: '팀원44444' },
];

interface AttendeeSelectorProps {
  selectedAttendees: string[];
  onSelectionChange: (newAttendees: string[]) => void;
}

const AttendeeSelector = ({ selectedAttendees, onSelectionChange }: AttendeeSelectorProps) => {
  const [isAttendeeListOpen, setIsAttendeeListOpen] = useState(false);

  // 드롭다운 + 트리거 영역 전체를 감쌀 ref
  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggleAttendee = (name: string) => {
    if (selectedAttendees.includes(name)) {
      onSelectionChange(selectedAttendees.filter((item) => item !== name));
    } else {
      onSelectionChange([...selectedAttendees, name]);
    }
  };

  useEffect(() => {
    if (!isAttendeeListOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const targetNode = event.target as Node | null;
      if (targetNode && !el.contains(targetNode)) {
        setIsAttendeeListOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isAttendeeListOpen]);

  return (
    <div ref={containerRef} className="relative space-y-3">
      <label className="block text-lg font-medium">참석자</label>

      <div
        onClick={() => setIsAttendeeListOpen((prev) => !prev)}
        className="flex min-h-12 w-full flex-wrap items-center gap-2 rounded-xl bg-white px-3.5 py-1.5 text-lg font-medium outline-1 -outline-offset-1 outline-gray-300"
      >
        {selectedAttendees.length === 0 ? (
          <span className="text-neutral-60">참석자를 선택하세요</span>
        ) : (
          selectedAttendees.map((name) => (
            <div
              key={name}
              className="bg-neutral-60 flex h-7.5 w-20 items-center justify-center rounded-md text-sm font-medium text-white"
            >
              <span className="w-full truncate text-center">{name}</span>
            </div>
          ))
        )}
      </div>

      {/* 드롭다운 목록 */}
      {isAttendeeListOpen && (
        <div className="absolute top-24 left-0 z-20 w-fit rounded-xl bg-white p-4 shadow-xl">
          <div className="flex flex-col gap-2">
            {DUMMY_MEMBERS.map((member) => {
              const isSelected = selectedAttendees.includes(member.name);

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3"
                  onClick={() => toggleAttendee(member.name)}
                >
                  {/* 이름 박스 */}
                  <div className="bg-neutral-60 flex h-7.5 w-20 items-center justify-center rounded-md text-sm font-medium text-white">
                    <span className="w-full truncate px-1 text-center">{member.name}</span>
                  </div>

                  <div className="flex h-6 w-6 items-center justify-center">
                    {isSelected ? (
                      <img src={checkIcon} alt="selected" className="h-6 w-6" />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-orange-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeSelector;
