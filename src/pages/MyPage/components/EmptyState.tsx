type EmptyStateProps = {
  title: string;
  description: string;
};

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-center whitespace-nowrap md:gap-3 md:py-14">
      <p className="text-[12px] font-medium text-black md:text-[24px]">{title}</p>
      <p className="text-[10px] text-black md:text-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
