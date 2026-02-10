type EmptyStateProps = {
  title: string;
  description: string;
};

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 text-[24px]">
      <p className="text-[24px] font-medium text-black">{title}</p>
      <p className="text-sm text-black">{description}</p>
    </div>
  );
};

export default EmptyState;
