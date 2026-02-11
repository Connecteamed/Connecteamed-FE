import type { Meeting } from './type';

interface MeetingListProps {
  meetings: Meeting[];
  onCreate: () => void;
  onOpen: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

const MeetingList = ({ meetings, onCreate, onOpen, onDelete }: MeetingListProps) => {
  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="border-neutral-30 border">
          <div className="bg-neutral-10 border-neutral-30 flex h-12 border-b px-5 py-3.5 text-sm font-medium">
            <div className="flex-1">회의명</div>
            <div className="w-32 text-center">참석자</div>
            <div className="w-32 text-center">회의 날짜</div>
            <div className="w-16 text-center"></div>
          </div>

          <div className="divide-neutral-30 divide-y">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="flex h-15 items-center px-4 py-3">
                <button
                  type="button"
                  className="text-neutral-90 flex h-14 flex-1 items-center truncate text-left font-medium"
                  onClick={() => onOpen(meeting.id)}
                >
                  {meeting.title}
                </button>
                <div className="text-neutral-90 w-32 truncate text-center text-sm">
                  {meeting.members}
                </div>
                <div className="text-neutral-90 w-32 text-center text-sm">{meeting.date}</div>
                <div className="flex w-16 justify-center">
                  <button onClick={() => onDelete(meeting.id)} className="text-neutral-70 text-xs">
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-7">
          <button
            onClick={onCreate}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white"
          >
            회의록 추가
          </button>
        </div>
      </div>

      {/* Mobile 카드 리스트 */}
      <div className="space-y-3 py-4 md:hidden">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="border-neutral-40 rounded-xl border bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="line-clamp-1 pt-1 text-left text-base font-medium text-neutral-900"
                onClick={() => onOpen(meeting.id)}
              >
                {meeting.title}
              </button>
              <button
                onClick={() => onDelete(meeting.id)}
                className="text-neutral-70 text-xs hover:text-neutral-700"
              >
                삭제
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center rounded-full py-1">
                {meeting.members || '참석자 없음'}
              </span>
              <span className="text-neutral-90 ml-auto">{meeting.date}</span>
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-4">
          <button
            onClick={onCreate}
            className="h-5 w-16 rounded-lg bg-orange-500 text-[8px] font-medium text-white"
          >
            회의록 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingList;
