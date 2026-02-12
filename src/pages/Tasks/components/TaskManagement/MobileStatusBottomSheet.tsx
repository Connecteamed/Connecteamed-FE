import { useEffect, useState } from 'react';

import MobileBottomSheet from '@/components/MobileBottomSheet';
import type { TaskStatusLabel } from '@/types/TaskManagement/task';

type Props = {
  isOpen: boolean;
  currentStatus?: TaskStatusLabel;
  onClose: () => void;
  onSave: (status: TaskStatusLabel) => void;
};

const statusOptions: TaskStatusLabel[] = ['시작 전', '진행 중', '완료'];

const MobileStatusBottomSheet = ({ isOpen, currentStatus = '시작 전', onClose, onSave }: Props) => {
  const [draftStatus, setDraftStatus] = useState<TaskStatusLabel>(currentStatus);

  useEffect(() => {
    if (isOpen) {
      setDraftStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  const handleSave = () => {
    onSave(draftStatus);
  };

  return (
    <MobileBottomSheet isOpen={isOpen} onClose={onClose} className="w-full max-w-full gap-6 py-5">
      <div className="w-full flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-6 px-5">
          <div className="w-full text-center text-lg font-medium text-black">업무상태 선택</div>
          <div className="w-full flex flex-col items-start">
            {statusOptions.map((status, idx) => {
              const isActive = draftStatus === status;
              const borderTop = idx === 0 ? 'border-t' : '';
              const bgClass = 'bg-white';
              return (
                <button
                  type="button"
                  key={status}
                  className={`w-full h-12 px-4 py-2 ${bgClass} flex flex-col justify-center items-start gap-2.5 border-b border-zinc-200 ${borderTop}`}
                  onClick={() => setDraftStatus(status)}
                >
                  <div className="inline-flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 ${
                        isActive ? 'bg-orange-500' : 'bg-white border border-zinc-200'
                      }`}
                    />
                    <div className="text-center text-black text-base font-medium">{status}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[10px] bg-orange-500 px-4 py-1 text-center text-sm font-medium text-white"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </MobileBottomSheet>
  );
};

export default MobileStatusBottomSheet;
