import reviewIcon from '@/assets/icon-light-bulb.svg';

interface EmptyAIReviewProps {
  title?: string;
  description?: string;
}

const EmptyAIReview = ({
  title = '저장된 회고가 없어요',
  description = '완료한 업무 리스트, 저장된 회고는 여기에 표시됩니다',
}: EmptyAIReviewProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24">
      <div className="mb-6 flex h-25 w-25 items-center justify-center rounded-full bg-orange-100 md:h-50 md:w-50">
        <img src={reviewIcon} alt="review icon" className="h-18 w-18 md:h-30 md:w-30" />
      </div>

      <div className="mb-3 text-center text-sm font-medium md:mb-4 md:text-2xl">{title}</div>
      <div className="mb-5 text-center text-[10px] font-normal md:mb-6 md:text-sm">
        {description}
      </div>
    </div>
  );
};

export default EmptyAIReview;
