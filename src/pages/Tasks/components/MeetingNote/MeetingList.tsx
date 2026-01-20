import type { Meeting } from './type';

interface MeetingListProps {
  meetings: Meeting[];
  onCreate: () => void;
  onDelete: (id: string | number) => void;
}

const MeetingList = ({ meetings, onCreate, onDelete }: MeetingListProps) => {
  return (
    <div className="w-full">
      <div>
        {/* 테이블 헤더*/}
        <div className="bg-neutral-10 flex h-12 px-5 py-3.5 text-sm font-medium">
          <div className="flex-1">회의명</div>
          <div className="w-32 text-center">참석자</div>
          <div className="w-32 text-center">회의 날짜</div>
          <div className="w-16 text-center"></div>
        </div>

        {/* 리스트 */}
        <div className="border-neutral-30 border">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="flex items-center px-4 py-3">
              <div className="text-neutral-90 flex h-14 flex-1 items-center truncate font-medium">
                {meeting.title}
              </div>
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
  );
};

export default MeetingList;
