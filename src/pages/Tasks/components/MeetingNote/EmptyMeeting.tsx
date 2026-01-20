interface EmptyMeetingProps {
  onCreate: () => void;
}

const EmptyMeeting = ({ onCreate }: EmptyMeetingProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-48 w-48 items-center justify-center rounded-full bg-orange-100">
        <img src="/src/assets/icon-minutes-orange.svg" alt="회의록" className="ml-4 h-24 w-20" />
      </div>
      <div className="mb-4 text-2xl font-medium">아직 작성된 회의록이 없어요</div>
      <div className="mb-6 text-sm font-normal text-gray-500">
        회의 내용을 정리해 팀원들과 공유해 보세요
      </div>
      <button
        onClick={onCreate}
        className="rounded-xl bg-orange-500 px-10 py-4 text-sm text-white transition hover:bg-orange-600"
      >
        회의록 추가
      </button>
    </div>
  );
};

export default EmptyMeeting;
