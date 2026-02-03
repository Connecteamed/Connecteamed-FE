const SearchCheckModal = () => {
  return (
    <div className="w-96 h-64 px-8 py-9 bg-white rounded-[10px] inline-flex flex-col justify-start items-start gap-2.5">
      <div className="w-96 flex flex-col justify-start items-center gap-4">
        <div className="self-stretch h-12 text-center justify-center text-3xl font-bold">
          00공모전
        </div>
        <div className="self-stretch h-12 text-center justify-center">
          해당 프로젝트에 참여 하시겠어요?
        </div>
        <div className="self-stretch inline-flex justify-start items-center gap-6">
          <div className="w-44 h-12 px-4 py-2 bg-zinc-300 rounded-[5px] outline-1 -outline-offset-1 outline-gray-200 flex justify-center items-center gap-2.5">
            <div className="text-center justify-center leading-4">
              아니요
            </div>
          </div>
          <div className="w-44 h-12 px-4 py-2 bg-blue-600 rounded-[5px] outline-1 -outline-offset-1 outline-gray-200 flex justify-center items-center gap-2.5">
            <div className="text-center justify-center text-white leading-4">
              예
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCheckModal;
