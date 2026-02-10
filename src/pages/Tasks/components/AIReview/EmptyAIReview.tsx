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
    <div className="flex flex-col items-center justify-center py-24">
      <div className="mb-8 flex h-50 w-50 items-center justify-center rounded-full bg-orange-100">
        <img src={reviewIcon} alt="review icon" className="h-30 w-30" />
      </div>

      <div className="mb-3 text-2xl font-medium text-black">{title}</div>
      <div className="text-sm font-normal">{description}</div>
    </div>
  );
};

export default EmptyAIReview;
