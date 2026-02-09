

export const GrassColorGuide = () => {

    return (
    <div className="flex items-center gap-[4px] text-[8px] font-medium text-neutral-80">
      <span className="mr-[2px]">적음</span>
      <div className="flex gap-1">
        <div className="h-[14px] w-[14px] rounded-[3px] bg-neutral-0" title="level 0"></div>
        <div className="h-[14px] w-[14px] rounded-[3px] bg-primary-100" title="level 1"></div>
        <div className="h-[14px] w-[14px] rounded-[3px] bg-primary-300" title="level 2"></div>
        <div className="h-[14px] w-[14px] rounded-[3px] bg-primary-500" title="level 3"></div>
        <div className="h-[14px] w-[14px] rounded-[3px] bg-primary-700" title="level 4"></div>
      </div>
      <span className="ml-[2px]">많음</span>
    </div>
  );
};

  export default GrassColorGuide;