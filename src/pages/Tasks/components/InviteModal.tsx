import React from 'react';

type InviteModalProps = {
  inviteCode?: string;
  projectName?: string;
  onClose?: () => void;
};

const InviteModal = ({ inviteCode = 'a47ab466le', projectName = '00공모전', onClose }: InviteModalProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
    } catch (error) {
      console.error('Failed to copy invite code', error);
    }
  };

  return (
    <div className="bg-white w-[660px] h-100 px-7.5 py-5 flex flex-col gap-4 justify-center items-center rounded-[20px]">
      <div className="w-full h-11 flex justify-center items-center text-2xl font-bold">
        입장코드
      </div>
      <div className="py-12.5 flex flex-col items-center justify-center gap-6">
        <div>코드를 팀원에게 공유하면 {projectName}에 초대할 수 있어요.</div>
        <div className="w-[510px] h-[76px] p-3.5 flex gap-6.5 bg-slate-100 rounded-[10px] justify-between items-center">
          <input className="w-[338px] h-12 text-2xl font-bold" type="text" readOnly value={inviteCode} />
          <button
            type="button"
            className="w-30 h-10 px-[25px] py-[2.5] bg-blue-600 rounded-[10px] flex items-center justify-center text-white text-xs"
            onClick={handleCopy}
          >
            복사하기
          </button>
        </div>
      </div>
      <button
        type="button"
        className="w-55 h-12 flex justify-center items-center bg-blue-600 px-10 py-3.5 rounded-[5px] text-white leading-4 cursor-pointer"
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  );
};

export default InviteModal;
