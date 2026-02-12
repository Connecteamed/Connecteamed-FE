type Props = {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  projectName?: string;
};

const SearchCheckModal = ({ onConfirm, onCancel, isLoading = false, projectName }: Props) => {
  return (
    <div className="flex w-64 flex-col items-center justify-center gap-3 rounded-[10px] bg-white p-6 md:h-[250px] md:w-[450px] md:gap-4 md:px-8 md:py-9">
      {/* 제목 */}
      <div className="text-center text-lg font-medium md:text-3xl md:font-bold">
        {projectName ?? '프로젝트'}
      </div>

      {/* 설명 */}
      <div className="text-center text-xs md:text-base">해당 프로젝트에 참여 하시겠어요?</div>

      {/* 버튼 영역 */}
      <div className="flex w-full justify-center gap-4 md:gap-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-6 w-20 items-center justify-center rounded-[5px] bg-zinc-300 text-[10px] md:h-12 md:w-44 md:text-base"
        >
          아니요
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex h-6 w-20 items-center justify-center rounded-[5px] text-[10px] text-white ${isLoading ? 'cursor-not-allowed bg-blue-300' : 'bg-blue-600'} md:h-12 md:w-44 md:text-base`}
        >
          {isLoading ? '진행중...' : '예'}
        </button>
      </div>
    </div>
  );
};

export default SearchCheckModal;
