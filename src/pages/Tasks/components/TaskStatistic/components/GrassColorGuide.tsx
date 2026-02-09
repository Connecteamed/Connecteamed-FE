export const GrassColorGuide = () => {
  return (
    <div className="text-neutral-80 flex items-center gap-[4px] text-[8px] font-medium">
      <span className="mr-[2px]">적음</span>
      <div className="flex gap-1">
        <div className="bg-neutral-20 h-[14px] w-[14px] rounded-[3px]" title="level 0"></div>
        <div className="bg-primary-100 h-[14px] w-[14px] rounded-[3px]" title="level 1"></div>
        <div className="bg-primary-300 h-[14px] w-[14px] rounded-[3px]" title="level 2"></div>
        <div className="bg-primary-500 h-[14px] w-[14px] rounded-[3px]" title="level 3"></div>
        <div className="bg-primary-700 h-[14px] w-[14px] rounded-[3px]" title="level 4"></div>
      </div>
      <span className="ml-[2px]">많음</span>
    </div>
  );
};

export default GrassColorGuide;
