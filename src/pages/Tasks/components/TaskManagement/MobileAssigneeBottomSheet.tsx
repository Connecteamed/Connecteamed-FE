import MobileBottomSheet from '@/components/MobileBottomSheet';

type Member = {
  projectMemberId: number;
  memberName?: string;
};

type Props = {
  isOpen: boolean;
  members: Member[];
  selectedIds: number[];
  onToggle: (projectMemberId: number) => void;
  onSave: () => void;
  onClose: () => void;
};

const MobileAssigneeBottomSheet = ({ isOpen, members, selectedIds, onToggle, onSave, onClose }: Props) => {
  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      className="h-[470px] w-full max-w-full py-5"
    >
      <div className="flex h-full w-full flex-col items-center gap-6">
        <div className="h-0 w-24 border-[3px] border-zinc-200" />
        <div className="w-full px-5 text-center text-lg font-medium text-black">업무상태 선택</div>

        <div className="flex w-full flex-1 flex-col overflow-y-auto">
          {members.length === 0 && (
            <div className="px-4 py-4 text-center text-sm text-neutral-500">프로젝트 멤버가 없어요</div>
          )}
          {members.map((member, idx) => {
            const selected = selectedIds.includes(member.projectMemberId);
            const borderTopClass = idx === 0 ? 'border-t' : '';
            return (
              <button
                type="button"
                key={member.projectMemberId}
                className={`flex h-12 w-full items-center border-b border-zinc-200 px-4 py-2 ${borderTopClass}`}
                onClick={() => onToggle(member.projectMemberId)}
              >
                <div className="inline-flex items-center gap-1.5">
                  <div
                    className={`h-6 w-6 rounded-[4px] ${
                      selected ? 'bg-orange-500' : 'border border-zinc-200 bg-white'
                    }`}
                  />
                  <div className="text-center text-base font-medium text-black">{member.memberName}</div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[10px] bg-orange-500 px-4 py-1 text-center text-sm font-medium text-white"
          onClick={onSave}
          disabled={!isOpen}
        >
          저장
        </button>
      </div>
    </MobileBottomSheet>
  );
};

export default MobileAssigneeBottomSheet;
