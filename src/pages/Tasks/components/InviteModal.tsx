import useGetProjectIniteCode from '@/hooks/MakeProject/Query/useGetProjectInviteCode';

type InviteModalProps = {
  projectId: number;
  projectName?: string;
  onClose?: () => void;
};

const InviteModal = ({ projectId, projectName, onClose }: InviteModalProps) => {
  const { data: inviteCode } = useGetProjectIniteCode(projectId);

  const showToast = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 transform';
    toast.innerHTML = `
      <div class="w-80 h-20 px-9 py-4 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-center items-center gap-2.5 shadow-lg">
        <div class="text-center justify-center text-black text-lg font-medium font-['Roboto']">입장 코드가 복사되었어요</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 1500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode?.inviteCode ?? '');
      showToast();
      onClose?.();
    } catch (error) {
      console.error('Failed to copy invite code', error);
    }
  };

  return (
    <div className="flex h-100 w-[660px] flex-col items-center justify-center gap-4 rounded-[20px] bg-white px-7.5 py-5">
      <div className="flex h-11 w-full items-center justify-center text-2xl font-bold">
        입장코드
      </div>
      <div className="h-0 self-stretch outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
      <div className="flex flex-col items-center justify-center gap-6 py-12.5">
        <div className="text-base">코드를 팀원에게 공유하면 {projectName}에 초대할 수 있어요.</div>
        <div className="flex h-[76px] w-[510px] items-center justify-between gap-6.5 rounded-[10px] bg-slate-100 p-3.5">
          <input
            className="h-12 w-[338px] text-2xl font-bold"
            type="text"
            readOnly
            value={inviteCode?.inviteCode ?? ''}
          />
          <button
            type="button"
            className="flex h-10 w-30 items-center justify-center rounded-[10px] bg-blue-600 px-[25px] py-[2.5] text-xs text-white"
            onClick={handleCopy}
          >
            복사하기
          </button>
        </div>
      </div>
      <div className="h-0 self-stretch outline outline-1 outline-offset-[-0.50px] outline-gray-200"></div>
      <button
        type="button"
        className="flex h-12 w-55 cursor-pointer items-center justify-center rounded-[5px] bg-blue-600 px-10 py-3.5 leading-4 text-white"
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  );
};

export default InviteModal;
