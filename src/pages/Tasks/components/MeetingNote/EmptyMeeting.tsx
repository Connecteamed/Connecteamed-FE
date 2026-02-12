import meetingNoteIcon from '@/assets/icon-minutes-orange.svg';

interface EmptyMeetingProps {
  onCreate: () => void;
}

const EmptyMeeting = ({ onCreate }: EmptyMeetingProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-20">
      <div className="mb-6 flex h-25 w-25 items-center justify-center rounded-full bg-orange-100 md:h-50 md:w-50">
        <img
          src={meetingNoteIcon}
          alt="회의록"
          className="ml-4 h-16 w-16 md:ml-4.5 md:h-25 md:w-33"
        />
      </div>

      <div className="mb-3 text-center text-sm font-medium md:mb-4 md:text-2xl">
        아직 작성된 회의록이 없어요
      </div>
      <div className="mb-5 text-center text-[10px] font-normal md:mb-6 md:text-sm">
        회의 내용을 정리해 팀원들과 공유해 보세요
      </div>

      <button
        onClick={onCreate}
        className="bg-primary-500 h-8.5 w-37.5 rounded-xl px-4 py-2 text-center text-sm font-medium text-white md:my-5 md:h-12 md:w-37.5 md:px-10 md:text-sm"
      >
        회의록 추가
      </button>
    </div>
  );
};

export default EmptyMeeting;
