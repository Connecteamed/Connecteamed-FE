import Calender from '@/components/calender';
import MobileBottomSheet from '@/components/MobileBottomSheet';

interface Props {
  isOpen: boolean;
  activeField: 'startDate' | 'endDate';
  startDisplay: string;
  endDisplay: string;
  activeDate: Date;
  onSelectTab: (field: 'startDate' | 'endDate') => void;
  onPickDate: (date: Date) => void;
  onSave: () => void;
  onClose: () => void;
  isSaveDisabled?: boolean;
}

const MobileScheduleBottomSheet = ({
  isOpen,
  activeField,
  startDisplay,
  endDisplay,
  activeDate,
  onSelectTab,
  onPickDate,
  onSave,
  onClose,
  isSaveDisabled,
}: Props) => {
  return (
    <MobileBottomSheet isOpen={isOpen} onClose={onClose} className="w-96 max-w-full gap-6 py-5">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-6 px-5">
          <div className="w-full text-center text-lg font-medium text-black">업무 일정 선택</div>
          <div className="flex w-full flex-col items-center gap-2.5 border-t border-b border-zinc-200 bg-white px-9 py-2">
            <div className="inline-flex items-center justify-start gap-px">
              <button
                type="button"
                className={`w-28 h-7 px-3.5 py-1.5 rounded-[5px] flex items-center justify-center text-base font-medium ${
                  activeField === 'startDate' ? 'bg-orange-500 text-white' : 'bg-zinc-200 text-neutral-400'
                }`}
                onClick={() => onSelectTab('startDate')}
              >
                시작일
              </button>
              <button
                type="button"
                className={`w-28 h-7 px-3.5 py-1.5 rounded-[5px] flex items-center justify-center text-base font-medium ${
                  activeField === 'endDate' ? 'bg-orange-500 text-white' : 'bg-zinc-200 text-neutral-400'
                }`}
                onClick={() => onSelectTab('endDate')}
              >
                마감일
              </button>
            </div>
            <div className="inline-flex items-center justify-start gap-[5px]">
              <div
                className={`w-28 h-4 text-center text-sm font-medium ${
                  startDisplay ? 'text-black' : 'text-gray-400'
                }`}
              >
                {startDisplay || '시작일 선택'}
              </div>
              <div
                className={`w-28 h-4 text-center text-sm font-medium ${
                  endDisplay ? 'text-black' : 'text-gray-400'
                }`}
              >
                {endDisplay || '마감일 선택'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start border-b border-zinc-200 px-5 pb-4">
          <div className="w-full flex justify-center rounded-[12px] bg-white">
            <Calender prev={activeDate} next={onPickDate} onClose={() => {}} />
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-72 items-center justify-center gap-2.5 rounded-[10px] bg-orange-500 px-20 py-1 text-center text-sm font-medium text-white"
          onClick={onSave}
          disabled={isSaveDisabled}
        >
          저장
        </button>
      </div>
    </MobileBottomSheet>
  );
};

export default MobileScheduleBottomSheet;
