import { useEffect, useMemo, useRef, useState } from 'react';

import checkIcon from '@/assets/icon-check-white.svg';

export interface AttendeeOption {
  id: number;
  name: string;
}

interface AttendeeSelectorProps {
  options?: AttendeeOption[];
  selectedAttendeeIds: number[];
  onSelectionChange: (nextIds: number[]) => void;
}

const AttendeeSelector = ({
  options = [],
  selectedAttendeeIds,
  onSelectionChange,
}: AttendeeSelectorProps) => {
  const [isAttendeeListOpen, setIsAttendeeListOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const memberOptions = useMemo(() => options, [options]);

  const selectedMembers = useMemo(
    () => memberOptions.filter((member) => selectedAttendeeIds.includes(member.id)),
    [memberOptions, selectedAttendeeIds],
  );

  const toggleAttendee = (id: number) => {
    if (selectedAttendeeIds.includes(id)) {
      onSelectionChange(selectedAttendeeIds.filter((item) => item !== id));
      return;
    }
    onSelectionChange([...selectedAttendeeIds, id]);
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
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isAttendeeListOpen]);

  return (
    <div ref={containerRef} className="relative space-y-3">
      <label className="block text-lg font-medium">참석자</label>

      <div
        onClick={() => setIsAttendeeListOpen((prev) => !prev)}
        className="flex min-h-12 w-full flex-wrap items-center gap-2 rounded-xl bg-white px-3.5 py-1.5 text-lg font-medium outline-1 -outline-offset-1 outline-gray-300"
      >
        {selectedMembers.length === 0 ? (
          <span className="text-neutral-60">참석자를 선택하세요</span>
        ) : (
          selectedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-neutral-60 flex h-7.5 min-w-20 items-center justify-center rounded-md px-2 text-sm font-medium text-white"
            >
              <span className="w-full truncate text-center">{member.name}</span>
            </div>
          ))
        )}
      </div>

      {isAttendeeListOpen && (
        <div className="absolute top-24 left-0 z-20 min-w-50 rounded-xl bg-white p-4 shadow-xl">
          <div className="flex flex-col gap-2">
            {memberOptions.length === 0 ? (
              <div className="text-center text-sm text-gray-500">참석자 목록이 없습니다</div>
            ) : (
              memberOptions.map((member) => {
                const isSelected = selectedAttendeeIds.includes(member.id);

                return (
                  <div
                    key={member.id}
                    className="flex cursor-pointer items-center gap-3"
                    onClick={() => toggleAttendee(member.id)}
                  >
                    <div className="bg-neutral-60 flex h-7.5 min-w-20 items-center justify-center rounded-md px-2 text-sm font-medium text-white">
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
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeSelector;
